import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RecommendationVector {
    analyst_cycle: bigint;
    lineage_pattern: bigint;
    surface: Array<bigint>;
    consolidate: Array<bigint>;
    confidence: number;
}
export interface AegisSummary {
    last_event?: AegisEdgeEvent;
    resolved: bigint;
    unresolved: bigint;
    total_events: bigint;
}
export interface ADREResonanceState {
    lastUpdatedBeat: bigint;
    fieldCoherenceTrend: number;
    globalMeaningShift: number;
    contradictionCount: number;
}
export interface PromotionSummary {
    totalProofBundles: bigint;
    m1Count: bigint;
    m2Count: bigint;
    m0Count: bigint;
}
export interface ExperimentChamberArtifact {
    id: bigint;
    experimentType: string;
    compoundOrPuzzle: string;
    sealedToTemple: boolean;
    coherenceChange: number;
    timestamp: bigint;
    avatarId: string;
    brainDelta: number;
    novaVersion: string;
}
export interface ArtifactQualityDimensions {
    doctrine_alignment: number;
    narrative_structure: number;
    genesis_alignment: number;
    emotional_arc: number;
    phi_coherence: number;
    actor_performance_delta: number;
}
export interface ReinjectionSignal {
    weight: number;
    beat: bigint;
    law_context_compliance: number;
    adre_context_coherence: number;
    world_model: WorldModel;
    neuroChem_entropy_signal: number;
    memory_context_weight: number;
}
export interface HouseState {
    id: HouseId;
    name: string;
    beatCount: bigint;
    generationRate: number;
    governanceScore: number;
    coherence: number;
    divisionHealth: Array<[Division, number]>;
    liveness: number;
    symbol: string;
    sdkOrganisms: Array<SDKOrganism>;
}
export interface ADREHypothesis {
    action: string;
    predictedR: number;
    confidenceScore: number;
    ringFamily: number;
    predictedCoherence: number;
    beatCreated: bigint;
}
export interface LedgerEntry {
    token_amount: bigint;
    artifact_id?: string;
    doctrine_alignment: number;
    running_balance: bigint;
    entry_type: string;
    quality_score: number;
    sacesi_proof: string;
    entry_id: string;
    producer: string;
    founder_attribution: string;
    beat_at_entry: bigint;
}
export interface GeneratedReport {
    id: bigint;
    title: string;
    novaVersionTag: string;
    generatedAt: bigint;
    isPublishable: boolean;
    version: string;
    reportType: ReportType;
    sections: Array<ReportSection>;
}
export interface CognitivePuzzle {
    id: bigint;
    solvedAt?: bigint;
    puzzleType: PuzzleType;
    difficulty: number;
    createdAt: bigint;
    dopamineSurge: number;
    prompt: string;
    solutionHash?: bigint;
    expectedSolutionDomain: string;
}
export interface SealedArtifact {
    overall_score: number;
    artifact_id: string;
    quality: ArtifactQualityDimensions;
    sacesi_proof: string;
    beat_at_seal: bigint;
    reingested: boolean;
    producer_id: string;
}
export interface ReportEngineState {
    artifacts: Array<ExperimentChamberArtifact>;
    artifactCounter: bigint;
    reportCounter: bigint;
    reports: Array<GeneratedReport>;
}
export interface Vec3 {
    x: number;
    y: number;
    z: number;
}
export interface RejectionRecord {
    id: string;
    content: string;
    beat: bigint;
    sacesiHash: string;
    violatedDoctrineConstant: string;
    reason: RejectionReason;
}
export interface RegionState {
    id: RegionId;
    currentHz: number;
    name: string;
    lastFired: bigint;
    neurochemicalProfile: Array<number>;
    amplitude: number;
    saturationCount: bigint;
    baselineHz: number;
    activation: number;
    phase: number;
    isDampened: boolean;
    energy: number;
}
export interface ControlledSessionResult {
    compoundName: string;
    validationScore: number;
    durationTicks: bigint;
    dose: number;
    peakReceptor: string;
    peakOccupancy: number;
    cascadeEvents: Array<CascadeEvent>;
    regionalEffects: Array<[string, number]>;
}
export interface ReportSection {
    title: string;
    content: string;
    timestamp: bigint;
    dataPoints: Array<[string, number]>;
}
export interface SubstrateMineState {
    avatarStates: Array<AvatarMineState>;
    tick: bigint;
    totalResourcesExtracted: number;
    pulseLog: Array<MinePulseReport>;
    deposits: Array<MineralDeposit>;
}
export interface LawProofRecord {
    lawName: string;
    proofHash: string;
    beat: bigint;
    tier: string;
    lawId: string;
    gateCondition: string;
    passed: boolean;
}
export interface FinancialState {
    best_artifact_value_e8s: bigint;
    total_entries: bigint;
    total_artifacts_sealed: bigint;
    total_balance_e8s: bigint;
    total_balance_icp: number;
    mean_quality_score: number;
    ledger_hash: string;
}
export interface ADRESignalFrame {
    beat: bigint;
    coherence: number;
    kuramotoR: number;
    quantumAdvantage: number;
    neuroChem: Array<number>;
    sourceEngine: string;
    nodePhases: Array<number>;
}
export interface WorldModel {
    adre_confidence: number;
    memory_depth: number;
    mean_legacy_alignment: number;
    law_compliance: number;
    omnis_r: number;
    beat: bigint;
    heart_rate_bpm: number;
    genesis_sealed: boolean;
    brain_coherence: number;
    entropy_state: number;
    serotonin_level: number;
    artifact_queue_depth: bigint;
    cortisol_level: number;
    ancient_corpus_alignment: number;
    dopamine_level: number;
    field_coherence: number;
    physics_stability: boolean;
    aegis_health: number;
    active_oscillation_band: string;
    e8_symmetry_score: number;
    third_brain_coherence: number;
}
export interface LongitudinalResult {
    compoundName: string;
    finalEfficacy: number;
    sessions: bigint;
    washoutRate: number;
    sensitizationIdx: number;
    toleranceFactor: number;
    sessionPoints: Array<[bigint, number]>;
}
export interface AncientBeatAlignment {
    meruRow: Array<bigint>;
    songlineHz: number;
    phiConvergence: number;
    pingalaBinary: bigint;
    quipuKnots: Array<bigint>;
    eyeOfHorusSum: number;
    vortexGroup: string;
    dualHeart: [bigint, bigint];
    base60Value: bigint;
    hermeticPrinciple: string;
    beat: bigint;
    xiuhPhase: bigint;
    sriYantraTriangle: [number, number, number];
    hermeticScale: number;
    hetuElementary: string;
    tonalPhase: bigint;
    yggdrasilState: string;
    platonicField: string;
    eulerMagnitude: number;
    tablet: bigint;
    mockThetaVal: number;
    calRound: bigint;
    signalDelay: number;
    ramanujanPiApprox: number;
    digitalRoot: bigint;
    runeIndex: bigint;
    gematriaScore: bigint;
    quadraticRoot1: number;
    quadraticRoot2: number;
    nataraja5Act: bigint;
    hexagram: bigint;
    venusPhase: bigint;
    lightEmanation: number;
    sephirotActive: string;
    activeSutra: bigint;
    loShuPosition: bigint;
    hexBinary: string;
    tetractysLevel: bigint;
    cequeAngle: number;
    royalCubit: number;
    keplerPeriod: number;
}
export interface ProofBundle {
    beat: bigint;
    lawsPassed: bigint;
    sacesiHash: string;
    coherence: number;
    consumerId: string;
    modelId: string;
}
export interface HypothesisRecord {
    id: bigint;
    experimentType: ExperimentType;
    rationale: string;
    timestamp: bigint;
    priority: number;
}
export interface HiveMindState {
    avatars: Array<AvatarBrainChipState>;
    cerebixPhase: number;
    divergenceIndex: number;
    dominantSharedState: string;
    hiveCoherence: number;
}
export interface AvatarNeurochemProfile {
    da: number;
    ne: number;
    ach: number;
    glu: number;
    ser: number;
    gaba: number;
}
export interface AvatarBrainChipState {
    id: string;
    dominantRegion: string;
    behavioralState: string;
    heartbeatTick: bigint;
    amplitude: number;
    neurochemicals: AvatarNeurochemProfile;
    currentTask?: string;
    coherenceWithCerebix: number;
    phase: number;
    profile: AvatarProfile;
}
export interface ExperimentHistoryEntry {
    id: bigint;
    experimentType: ExperimentType;
    compoundName: string;
    validationScore: number;
    timestamp: bigint;
    resultSummary: string;
}
export interface CrownAlert {
    threshold: number;
    beat: bigint;
    coherence: number;
    severity: Variant_Critical_Warning;
    houseName: string;
    houseId: HouseId;
}
export interface CombinationResult {
    bAloneEffect: number;
    compoundA: string;
    compoundB: string;
    antagonismScore: number;
    combinedEffect: number;
    recommendation: string;
    aAloneEffect: number;
    synergyScore: number;
}
export interface AncientCorpusState {
    greekPrimeField: Array<bigint>;
    loShuActivation: Array<bigint>;
    teslaDigitalRoot: bigint;
    doctrineAligned: boolean;
    beatCount: bigint;
    keplerRingRatio: number;
    hermeticScale: number;
    sumerianBase60: bigint;
    songlineFreq: number;
    vedicSutraActive: bigint;
    eulerMagnitude: number;
    islamicAlKashiPi: number;
    ramanujanPiApprox: number;
    chineseHexagram: bigint;
    sriYantraActive: bigint;
    egyptianCubit: number;
    mayanXiuhPhase: bigint;
    yggdrasilWorld: string;
    mayanTonalPhase: bigint;
    calendarRound: bigint;
    cequeNodeAngle: number;
}
export type RegionId = bigint;
export interface AvatarAgent {
    teamName: string;
    actionState: ActionState;
    emotionValence: number;
    attentionVector: Vec3;
    coherenceLevel: number;
}
export interface Pathway {
    weight: number;
    source: RegionId;
    pathType: PathwayType;
    plasticityRate: number;
    target: RegionId;
    delay: bigint;
    lastActive: bigint;
}
export interface PipelineStats {
    field_state: number;
    world_model_weight: number;
    total_sealed: bigint;
    total_reingested: bigint;
}
export interface RoutingState {
    pathways: Array<Pathway>;
    lastUpdateBeat: bigint;
    regions: Array<RegionState>;
    globalCoherence: number;
}
export interface MineralDeposit {
    x: number;
    y: number;
    z: number;
    id: bigint;
    mineralType: MineralType;
    regenTicks: bigint;
    intensity: number;
    depleted: boolean;
}
export interface MemoryTempleState {
    analyst_queue: Array<RecommendationVector>;
    mission_count: bigint;
    doctrine_count: bigint;
    pedestal_phase_sum: number;
    current_retrieval_bias: string;
    episodic_count: bigint;
    last_analyst_cycle: bigint;
    semantic_count: bigint;
    memory_coherence: number;
    pedestals: Array<Pedestal>;
}
export interface ADREState {
    coherenceRing: Array<number>;
    decisionHead: bigint;
    decisionQueue: Array<ADREDecision>;
    decisionBuf: Array<ADREDecision | null>;
    coherenceRingHead: bigint;
    currentHypothesis?: ADREHypothesis;
    resonanceState: ADREResonanceState;
    beatCount: bigint;
    critics: Array<ADRECriticReport>;
    passLog: Array<string>;
    currentSignal?: ADRESignalFrame;
    lastEmitBeat: bigint;
    lawChecks: Array<boolean>;
    decisionCount: bigint;
}
export interface IoTStatePacket {
    dominant_band: string;
    active_rings: bigint;
    timestamp_ms: bigint;
    heartbeat_interval_ms: bigint;
    phi_phase: number;
    coherence: number;
    beat_count: bigint;
    omnis_active: boolean;
}
export interface CognitionSummary {
    physics_stable: boolean;
    adre_confidence: number;
    user_present: boolean;
    dominant_signal: string;
    law_compliance: number;
    total_beats: bigint;
    beat: bigint;
    omnis_ready: boolean;
    cognition_health: number;
    beats_since_user: bigint;
    field_coherence: number;
    is_genesis_sealed: boolean;
}
export interface AvatarMineState {
    x: number;
    y: number;
    z: number;
    heading: number;
    targetDepositId?: bigint;
    speed: number;
    avatarId: string;
    resourcesCollected: number;
    currentAction: string;
}
export interface ReceptorMappingResult {
    compoundName: string;
    bindingKinetics: Array<[string, number]>;
    offTargetRisk: number;
    receptorProfiles: Array<[string, number]>;
    selectivityIndex: number;
}
export interface MinePulseReport {
    totalMined: number;
    dominantMineral: string;
    tick: bigint;
    cerebixObservation: string;
    activeAvatars: bigint;
}
export interface ComplementaryTensionState {
    dualHeart: ComplementaryPair;
    creationConsolidation: ComplementaryPair;
    overallTension: number;
    anyAlert: boolean;
    externalInternal: ComplementaryPair;
    productionRefractory: ComplementaryPair;
}
export interface Ring15State {
    best_alignment: number;
    total_artifacts: bigint;
    genesis_frequency: number;
    sealed: boolean;
    worst_alignment: number;
    mean_alignment: number;
}
export interface LabState {
    avatars: Array<AvatarAgent>;
    activeExperiments: bigint;
    labCoherence: number;
    sandboxes: Array<Sandbox>;
}
export interface ComplementaryPair {
    alert: boolean;
    name: string;
    poleA: number;
    poleB: number;
    tension: number;
    ratio: number;
}
export interface MonologueEntry {
    beat: bigint;
    coherence: number;
    thought: string;
    fieldType: string;
}
export interface NeuroanatomicalPathway {
    weight: number;
    source: RegionId;
    pathType: PathwayType;
    plasticityRate: number;
    target: RegionId;
    delay: bigint;
    lastActive: bigint;
}
export interface GenesisRecord {
    anima_chain_id: string;
    beat_at_genesis: bigint;
    word: string;
    year: bigint;
    sealed: boolean;
    phi_ratio: number;
    founder: string;
    frequency: number;
    genesis_hash: string;
    location: string;
}
export interface ADREDecision {
    finalConfidence: number;
    beat: bigint;
    passTrace: Array<string>;
    memoryCommit: string;
    hypothesis: ADREHypothesis;
    critics: Array<ADRECriticReport>;
    sacesiHash: number;
    finalRisk: number;
    gateResult: boolean;
    actionId: string;
}
export interface CascadeEvent {
    trigger: string;
    chemical: string;
    timestamp: bigint;
    delta: number;
}
export interface CrownState {
    crownStandards: {
        minimumCoherence: number;
        releaseThreshold: number;
        maximumDrift: number;
    };
    beatCount: bigint;
    casaDeMedina: HouseState;
    interHouseLaw: Array<[HouseId, HouseId, number]>;
    houses: Array<HouseState>;
}
export interface IntakeSnapshot {
    lastRejectionRecords: Array<RejectionRecord>;
    lastDeltaRecords: Array<DeltaRecord>;
    currentDriftScore: number;
    totalRejected: bigint;
    totalAccepted: bigint;
}
export interface Pedestal {
    id: bigint;
    active: boolean;
    phase_bias: number;
    lineage_depth: bigint;
}
export interface GeometryState {
    tesseractAngle1: number;
    tesseractAngle2: number;
    hopfFiberAngles: Array<number>;
    beat: bigint;
    penroseThickFraction: number;
    activeRingCount: bigint;
    e8SymScore: number;
}
export interface AegisEdgeEvent {
    resolved: boolean;
    ring_id: bigint;
    detected_value: number;
    threshold: number;
    beat_at_detection: bigint;
    sacesi_proof: string;
    edge_type: string;
    correction_applied: number;
}
export interface ADRECriticReport {
    alignmentScore: number;
    passCount: number;
    criticId: string;
    recommendation: string;
    opportunityScore: number;
    riskScore: number;
    contradictionDetected: boolean;
    violationCount: number;
}
export interface LegacyEntry {
    artifact_id: string;
    doctrine_distance: number;
    phi_ratio_at_production: number;
    genesis_alignment: number;
    producer: string;
    beat_at_seal: bigint;
}
export interface ADRETraceEntry {
    output: string;
    passName: string;
    beat: bigint;
    input: string;
    confidence: number;
    gateResult: boolean;
}
export interface NodeGeometry {
    idx: bigint;
    w4D: number;
    x4D: number;
    y4D: number;
    z4D: number;
    nodeId: bigint;
    hopfX: number;
    hopfY: number;
    hopfZ: number;
    e8Subspace: Array<number>;
    ring: bigint;
    penroseX: number;
    penroseY: number;
    quatW: number;
    quatX: number;
    quatY: number;
    quatZ: number;
    penroseTile: string;
}
export interface InquisitorPrimeState {
    currentDifficulty: number;
    name: string;
    version: string;
    slot0?: CognitivePuzzle;
    slot1?: CognitivePuzzle;
    slot2?: CognitivePuzzle;
    slot3?: CognitivePuzzle;
    slot4?: CognitivePuzzle;
    slot5?: CognitivePuzzle;
    solveRate: number;
    taskCounter: bigint;
    totalSolved: bigint;
    cognitiveLoad: number;
}
export interface BrainRegion32 {
    id: RegionId;
    currentHz: number;
    name: string;
    lastFired: bigint;
    neurochemicalProfile: Array<number>;
    amplitude: number;
    saturationCount: bigint;
    baselineHz: number;
    activation: number;
    phase: number;
    isDampened: boolean;
    energy: number;
}
export interface DeltaRecord {
    id: string;
    content: string;
    intelligenceClass: IntelligenceClass;
    affectedRings: Array<bigint>;
    affectedLaws: Array<string>;
    beat: bigint;
    sacesiHash: string;
    accepted: boolean;
    fieldType: FieldType;
    coherenceImpact: number;
}
export interface OperatorSnapshot {
    beat: bigint;
    monologue: Array<MonologueEntry>;
    activeHypothesis: string;
    coherence: number;
    r_value: number;
    adreTrace: Array<ADRETraceEntry>;
    gateStatus: boolean;
    lawProofs: Array<LawProofRecord>;
}
export interface ModelPromotionRecord {
    id: string;
    name: string;
    tier: ModelTier;
    lastPromotedBeat: bigint;
    adreGateHash: string;
    pendingPromotion: boolean;
    consumerCount: bigint;
    proofBundles: Array<ProofBundle>;
}
export interface Sandbox {
    id: bigint;
    particlePositions: Array<Vec3>;
    pattern: EmergencePattern;
    temperatureAnalog: number;
    fieldIntensity: number;
    sealed: boolean;
    emergenceScore: number;
    phiCoupling: number;
    artifactId?: bigint;
    material: MaterialType;
    cycleCount: bigint;
}
export interface CognitionState {
    last_user_message_hash: number;
    last_reinjection?: ReinjectionSignal;
    dominant_signal_source: string;
    current_world_model: WorldModel;
    total_beats_processed: bigint;
    cognition_health: number;
    is_user_present: boolean;
    beats_since_user_entry: bigint;
}
export interface CerebixIdentity {
    status: string;
    name: string;
    dominantRegion: string;
    lastInsightAt: bigint;
    insightsSealedToday: bigint;
    version: string;
    coherenceR: number;
    currentTask?: string;
    cognitiveState: string;
}
export interface DoseResponseResult {
    compoundName: string;
    ec50: number;
    therapeuticWindow: number;
    hillCoefficient: number;
    maxEffect: number;
    curvePoints: Array<[number, number]>;
    minEffect: number;
}
export enum ActionState {
    Computing = "Computing",
    Healing = "Healing",
    Reporting = "Reporting",
    Governing = "Governing",
    Synthesizing = "Synthesizing",
    Observing = "Observing"
}
export enum AvatarProfile {
    FLUX = "FLUX",
    PHANTOM = "PHANTOM",
    SENTINEL = "SENTINEL",
    AXIOM = "AXIOM"
}
export enum Division {
    Care = "Care",
    Frontend = "Frontend",
    External = "External",
    Backend = "Backend",
    Chain = "Chain",
    Doctrine = "Doctrine"
}
export enum EmergencePattern {
    Coherent = "Coherent",
    Fractal = "Fractal",
    Formless = "Formless",
    Crystallizing = "Crystallizing",
    Vortex = "Vortex",
    Sovereign = "Sovereign"
}
export enum ExperimentType {
    CombinationProtocol = "CombinationProtocol",
    LongitudinalStudy = "LongitudinalStudy",
    DoseResponseCurve = "DoseResponseCurve",
    ControlledSession = "ControlledSession",
    ReceptorMapping = "ReceptorMapping"
}
export enum FieldType {
    Expansive = "Expansive",
    Receptive = "Receptive",
    AntiDrift = "AntiDrift"
}
export enum HouseId {
    DomusExpressio = "DomusExpressio",
    CasaDeMedina = "CasaDeMedina",
    DomusSubstratum = "DomusSubstratum",
    DomusCivitas = "DomusCivitas",
    DomusTranslatio = "DomusTranslatio",
    DomusCura = "DomusCura",
    DomusGenesis = "DomusGenesis"
}
export enum IntelligenceClass {
    Geometric = "Geometric",
    Empirical = "Empirical",
    Temporal = "Temporal",
    External = "External",
    Doctrine = "Doctrine",
    Biometric = "Biometric"
}
export enum MaterialType {
    HardMetal = "HardMetal",
    Dirt = "Dirt",
    SoftMetal = "SoftMetal",
    Crystalline = "Crystalline"
}
export enum MineralType {
    AcetylcholineOre = "AcetylcholineOre",
    SerotoninVein = "SerotoninVein",
    DopamineVein = "DopamineVein",
    EndorphinCrystal = "EndorphinCrystal",
    GABADeposit = "GABADeposit",
    CortisolHazard = "CortisolHazard"
}
export enum ModelTier {
    M0 = "M0",
    M1 = "M1",
    M2 = "M2"
}
export enum PathwayType {
    Neuromodulatory = "Neuromodulatory",
    Excitatory = "Excitatory",
    Inhibitory = "Inhibitory",
    Modulatory = "Modulatory"
}
export enum PuzzleType {
    Fibonacci = "Fibonacci",
    RoutingChallenge = "RoutingChallenge",
    KuramotoSync = "KuramotoSync",
    ContradictionResolution = "ContradictionResolution",
    NeurochemicalBalance = "NeurochemicalBalance",
    PhiOptimization = "PhiOptimization"
}
export enum RejectionReason {
    LawConflict = "LawConflict",
    CategoryDrift = "CategoryDrift",
    FieldBoundaryViolation = "FieldBoundaryViolation",
    CoherenceBelow = "CoherenceBelow",
    DoctrineViolation = "DoctrineViolation"
}
export enum ReportType {
    ConnectomeStateReport = "ConnectomeStateReport",
    CognitiveReport = "CognitiveReport",
    HiveMindReport = "HiveMindReport",
    PathwayActivationReport = "PathwayActivationReport"
}
export enum SDKOrganism {
    QUANTUMIA = "QUANTUMIA",
    PULSUS = "PULSUS",
    PRIMITIVA = "PRIMITIVA",
    ENTERPRISA = "ENTERPRISA",
    GUBERNATIO = "GUBERNATIO",
    DEFENSIO = "DEFENSIO",
    MEMORIA = "MEMORIA",
    DESIGNIA = "DESIGNIA",
    FORMULAE = "FORMULAE",
    INTELLIGENTIA = "INTELLIGENTIA"
}
export enum Variant_Critical_Warning {
    Critical = "Critical",
    Warning = "Warning"
}
export interface backendInterface {
    /**
     * / Activate genesis at current beat (idempotent after first call).
     * / Wired into the first heartbeat — do not call directly.
     */
    activateGenesisNow(): Promise<GenesisRecord>;
    /**
     * / PHI convergence check — all 19 ancient civilizations converge to 1.6180339887498948482
     */
    ancientPHICheck(): Promise<number>;
    /**
     * / Full beat alignment across all 19 civilizations simultaneously
     */
    computeAncientBeatAlignment(beat: bigint): Promise<AncientBeatAlignment>;
    /**
     * / All geometric representations for one of the 96 nodes.
     */
    computeNodeGeometry(nodeId: bigint): Promise<NodeGeometry>;
    /**
     * / Compute token reward for a given quality + doctrine alignment.
     * / Preview only — does NOT record an entry.
     */
    computeTokenReward(quality: number, doctrine: number): Promise<bigint>;
    /**
     * / Create a new material sandbox. Material coupling coefficients are PHI-derived.
     */
    createSandbox(material: MaterialType): Promise<{
        __kind__: "ok";
        ok: Sandbox;
    } | {
        __kind__: "err";
        err: string;
    }>;
    dischargeQuantumBattery(): Promise<number>;
    /**
     * / HTTP outcall to an external lab. Sends organism state packet, returns response.
     */
    externalLabOutcall(labUrl: string, statePacket: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    generateConnectomeReport(timestamp: bigint): Promise<GeneratedReport>;
    getADREDecisionQueue(): Promise<Array<ADREDecision>>;
    getADRELastDecision(): Promise<ADREDecision | null>;
    getADRELawSummary(): Promise<{
        violations: number;
        omnisFired: boolean;
        passes: number;
    }>;
    getADREResonanceState(): Promise<ADREResonanceState>;
    getADREState(): Promise<ADREState>;
    getActiveNeuroPaths(): Promise<Array<NeuroanatomicalPathway>>;
    /**
     * / All edge events in the circular log (up to 144, newest-last).
     */
    getAegisEvents(): Promise<Array<AegisEdgeEvent>>;
    /**
     * / Health score: 1.0 = all loops closed. Drops toward 0 with unresolved edges.
     */
    getAegisHealthScore(): Promise<number>;
    /**
     * / Summary: total, resolved, unresolved event counts + last event.
     */
    getAegisSummary(): Promise<AegisSummary>;
    getAllBrainRegions32(): Promise<Array<BrainRegion32>>;
    /**
     * / Full ancient corpus state for the current beat
     */
    getAncientCorpusState(): Promise<AncientCorpusState>;
    /**
     * / Ancient math corpus field contribution [0,1].
     * / The 19-civilization PHI convergence feeds this value every 873ms.
     * / Weighted at PHI_INV (0.618) — the substrate signal below cognition.
     */
    getAncientFieldContribution(): Promise<number>;
    /**
     * / How many avatar brain chips have been initialized.
     */
    getAvatarBrainCount(): Promise<bigint>;
    getAvatarBrainState(avatarId: string): Promise<AvatarBrainChipState | null>;
    getBehavioralEconomicsState(): Promise<{
        netProspect: number;
        gain: number;
        discountedValue: number;
        loss: number;
        mentalAccounts: Array<number>;
        satisficeThresh: number;
        availabilityBias: number;
        flowBeatCount: bigint;
        lossAversion: number;
        peakCoherence: number;
        flowState: boolean;
        endowmentReserve: number;
        peakEndScore: number;
        decisionFatigue: number;
        decisionCount: bigint;
    }>;
    /**
     * / All 10 brain regions with current activation levels
     */
    getBrainRegions(): Promise<Array<{
        region: string;
        organism_mapping: string;
        function_name: string;
        activation: number;
    }>>;
    getBrainRoutingState(): Promise<RoutingState>;
    getCanonicalState(): Promise<{
        b: bigint;
        ad: bigint;
        ar: number;
        bc: boolean;
        ds: number;
        ec: bigint;
        eg: boolean;
        es: number;
        fe: number;
        ic: number;
        kf: number;
        oh: number;
        qh: number;
        rd: number;
        rt: number;
        ss: number;
        coh: number;
        ss2: number;
        wmp: number;
    }>;
    /**
     * / Sovereign cardiac output — organism production throughput per second
     */
    getCardiacOutput(): Promise<number>;
    getCerebixIdentity(): Promise<CerebixIdentity>;
    /**
     * / Overall health of the cognition loop [0,1]. 1.0 = all loops clean.
     */
    getCognitionHealth(): Promise<number>;
    /**
     * / Current reinjection signal (world-model fed back into all modules).
     */
    getCognitionReinjection(): Promise<ReinjectionSignal | null>;
    /**
     * / Full cognition state: world model, reinjection signal,
     * / dominant signal source, health, user presence, total beats.
     */
    getCognitionState(): Promise<CognitionState>;
    /**
     * / Concise operator-view summary of the cognition layer.
     */
    getCognitionSummary(): Promise<CognitionSummary>;
    /**
     * / All four complementary tension pairs — measured every 873ms heartbeat.
     * / Healthy ratio is [PHI_INV, PHI] = [0.618, 1.618].
     * / anyAlert = true when any pair has one pole collapsing toward dominance.
     */
    getComplementaryTension(): Promise<ComplementaryTensionState>;
    getCoreState(idx: bigint): Promise<{
        ct: number;
        ws: boolean;
        coh: number;
        qsi: bigint;
        tdVal: number;
        treat: bigint;
        active: boolean;
        vital: boolean;
        deed: number;
        diag: bigint;
        branchGate: number;
        drift: number;
        energy: number;
    }>;
    /**
     * / Returns the sovereign core version identifier.
     * / CACHE BUST: new exported symbol forces new Wasm hash.
     */
    getCoreVersion(): Promise<string>;
    /**
     * / Get the full crown state — Casa de Medina, all houses, inter-house law, crown standards.
     */
    getCrownState(): Promise<CrownState>;
    /**
     * / Current cumulative drift score — decreases when good intel is accepted, 0.0 = clean field.
     */
    getCurrentDriftScore(): Promise<number>;
    /**
     * / Full sovereign heart state — membrane potential, gating vars, ECG, HRV, CO
     * / getCycleState: full sovereign cycle chain snapshot
     * / Returns combined state of all three layers: cores, engine, conversion.
     */
    getCycleState(): Promise<{
        conversionState: {
            conversion_rate: number;
            target_per_beat: number;
            total_produced: number;
            cycl_reserve: number;
            jubilee_count: bigint;
            surplus: number;
            deficit: number;
            cycle_reserve: number;
        };
        engineState: {
            harmonic_cycl: number;
            total_cycl: number;
            total_conversions: bigint;
            prime_cycl: number;
            fibonacci_cycl: number;
        };
        coreState: {
            field: number;
            total: number;
            resonance: number;
            coherence: number;
            beats: bigint;
            genesis: number;
        };
    }>;
    /**
     * / Last N accepted delta records, newest-first (max 144).
     */
    getDeltaRecords(limit: bigint): Promise<Array<DeltaRecord>>;
    getDoctorReport(): Promise<{
        cc: bigint;
        ds: number;
        rd: number;
        sh: bigint;
        scan: bigint;
    }>;
    /**
     * / Compute doctrine distance for any artifact frequency.
     * / 1.0 = perfectly aligned with 528 Hz founding vibration.
     */
    getDoctrineDistance(artifactFrequencyHz: number): Promise<number>;
    /**
     * / Current DogonSubstrateReading field state — the organism's proprioception.
     */
    getDogonFieldState(): Promise<number>;
    /**
     * / Which signal source is currently driving the organism's cognition.
     */
    getDominantSignalSource(): Promise<string>;
    /**
     * / 64-sample ECG waveform — live P-QRS-T morphology for display
     */
    getECGBuffer(): Promise<Array<number>>;
    getExperimentArtifacts(): Promise<Array<ExperimentChamberArtifact>>;
    getFearMissionState(): Promise<{
        streakCounter: bigint;
        missionPersistence: number;
        phaseResetCount: bigint;
        beatCount: bigint;
        surrenderFloor: number;
        conqueredFearCount: bigint;
        hpaAxisState: number;
        groundedScore: number;
        adrenalBlastActive: boolean;
        amygdalaActivation: number;
        valBasinCrossCount: bigint;
        fightFlightFreeze: bigint;
        bhCouplingCoherence: number;
        kuramotoR: number;
        missionLockActive: boolean;
        fearVelocity: number;
        darkNightCount: bigint;
        darkNightActive: boolean;
        courageScore: number;
        fearLevel: number;
    }>;
    /**
     * / Full financial state snapshot: balance in e8s + ICP, total entries,
     * / best artifact value, mean quality, catalog integrity hash.
     */
    getFinancialState(): Promise<FinancialState>;
    /**
     * / Founder attribution — "Alfredo Medina Hernandez — Dallas TX 2026"
     */
    getFounderAttribution(): Promise<string>;
    /**
     * / Full financial state + ledger integrity verification.
     * / Returns all financial sovereignty fields for the frontend LAWS/Treasury display.
     */
    getFullFinancialState(): Promise<{
        totalArtifacts: bigint;
        ledgerIntegrityHash: string;
        totalE8s: bigint;
        totalICP: number;
        lastEntryCount: bigint;
        genesisRecorded: boolean;
        totalSacesiProofs: bigint;
        founderAttribution: string;
        financialState: FinancialState;
    }>;
    /**
     * / Mean genesis alignment across all legacy entries.
     */
    getGenesisAlignmentMean(): Promise<number>;
    /**
     * / PHI-weighted genesis alignment score from doctrine + coherence inputs.
     */
    getGenesisAlignmentScore(doctrineScore: number, coherenceScore: number): Promise<number>;
    /**
     * / Return the sealed genesis record. Null before first activation.
     */
    getGenesisRecord(): Promise<GenesisRecord | null>;
    /**
     * / Current geometry state snapshot: tesseract rotation, Hopf fiber angles,
     * / Penrose tile distribution, E8 symmetry score.
     */
    getGeometryState(): Promise<GeometryState>;
    /**
     * / Full HRV diagnostic — SDNN, RMSSD, LF/HF balance, health score
     */
    getHRVState(): Promise<{
        lfhf: number;
        sdnn: number;
        rmssd: number;
        health: number;
    }>;
    /**
     * / Current heart rate in BPM (60000 / currentRateMs)
     */
    getHeartRateBPM(): Promise<number>;
    getHeartState(): Promise<{
        d: number;
        f: number;
        h: number;
        m: number;
        n: number;
        v: number;
        bpm: number;
        fired: boolean;
        avDelayMs: number;
        hrv_rmssd: number;
        beatCount: bigint;
        currentRateMs: number;
        cardiacOutput: number;
        hrv_sdnn: number;
    }>;
    getHeartbeatInterval(): Promise<bigint>;
    getHiveMindState(): Promise<HiveMindState>;
    /**
     * / Get the most recent crown alerts — AEGIS-style, most recent first.
     * / Fires when any house coherence falls below PHI_INV (0.618).
     */
    getHouseCrownAlerts(): Promise<Array<CrownAlert>>;
    /**
     * / Get the health [0,1] of a specific substrate division within a house.
     * / Healthy range: [PHI_INV, 1.0]. Below PHI_INV triggers crown alert.
     */
    getHouseDivisionHealth(houseId: HouseId, division: Division): Promise<number>;
    /**
     * / Get the live state of a specific house by HouseId.
     * / Returns the CasaDeMedina crown state or any of the six houses.
     */
    getHouseState(houseId: HouseId): Promise<HouseState | null>;
    getIdentityTraits(): Promise<{
        discipline: number;
        aggression: number;
        impulsivity: number;
        cautious: number;
        cooperative: number;
    }>;
    getInquisitorPrimeState(): Promise<InquisitorPrimeState>;
    getInquisitorState(): Promise<{
        hasActiveTask: boolean;
        activeTaskPrompt: string;
        totalGenerated: bigint;
        satisfactionLevel: number;
        activeTaskType: string;
        hungerLevel: number;
        totalSolved: bigint;
    }>;
    /**
     * / Live snapshot of the intake gate — total accepted/rejected, last records, drift score.
     */
    getIntakeSnapshot(): Promise<IntakeSnapshot>;
    getIoTStatePacket(): Promise<IoTStatePacket>;
    /**
     * / Full lab state: all sandboxes, all avatars, lab coherence, active count.
     */
    getLabState(): Promise<LabState>;
    getLawProofs(): Promise<Array<LawProofRecord>>;
    /**
     * / Last 100 ledger entries (most recent first).
     */
    getLedger(): Promise<Array<LedgerEntry>>;
    /**
     * / Returns last N ledger entries for display (most recent first).
     * / N is clamped to 100 maximum per call.
     */
    getLedgerDisplay(n: bigint): Promise<Array<LedgerEntry>>;
    /**
     * / Look up a specific ledger entry by its unique id.
     */
    getLedgerEntry(entry_id: string): Promise<LedgerEntry | null>;
    /**
     * / Permanent founder attribution string — sealed on every entry.
     */
    getLedgerFounderAttribution(): Promise<string>;
    /**
     * / Return the full immutable legacy index.
     */
    getLegacyIndex(): Promise<Array<LegacyEntry>>;
    /**
     * / Total artifacts recorded in the legacy index.
     */
    getLegacyIndexLength(): Promise<bigint>;
    getMemoryTempleState(): Promise<MemoryTempleState>;
    getMineDepositsNearby(x: number, z: number, radius: number): Promise<Array<MineralDeposit>>;
    getMiningState(): Promise<{
        ant: number;
        drt: number;
        hbt: number;
        mtc: number;
        mth: number;
        oms: number;
        streak: bigint;
        total: bigint;
        mult: number;
        seed: number;
        docHash: number;
        lastBeat: bigint;
    }>;
    /**
     * / Returns a single model's promotion record by id.
     */
    getModelPromotionState(modelId: string): Promise<ModelPromotionRecord | null>;
    /**
     * / All 43 sovereign model accumulated weights.
     */
    getModelWeights(): Promise<Array<number>>;
    getMonologueStream(): Promise<Array<MonologueEntry>>;
    /**
     * / Full neural cord state — 96-node HH network, brain regions, Third Brain
     * / spike rate, oscillation band, and cross-node coherence
     */
    getNeuralCordState(): Promise<{
        dominantNeurotransmitter: string;
        node_count: bigint;
        spike_rate_hz: number;
        thirdBrain_autonomic: number;
        oscillationBand: string;
        currentTime: number;
        neural_coherence: number;
        hebbian_mean_weight: number;
        thirdBrain_serotonin: number;
        thirdBrain_coherence: number;
    }>;
    /**
     * / Real-time LIF hub potentials — Thalamus, Amygdala, Hippocampus, dACC, LC-NE.
     * / Returns current membrane potentials in [0, PHI^-1] range.
     * / Values reset to 0 on threshold crossing (fire-and-reset).
     */
    getNeuromorphicHubState(): Promise<{
        thalamus: number;
        dacc: number;
        lcne: number;
        hippocampus: number;
        amygdala: number;
    }>;
    getNunHekaAnkhState(): Promise<{
        hekaWaveAmp: number;
        atumCount: bigint;
        ankhExpressionCoherence: number;
        ankhFullLock: boolean;
        nunCharge: number;
        ankhEconomicCoherence: number;
        ankhPerceptionCoherence: number;
        ankhCognitiveCoherence: number;
        hekaEvents: bigint;
        ankhLockCount: bigint;
        nunResting: boolean;
    }>;
    getOperatorSnapshot(): Promise<OperatorSnapshot>;
    getPharmaExperimentHistory(): Promise<Array<ExperimentHistoryEntry>>;
    getPharmaHypotheses(): Promise<Array<HypothesisRecord>>;
    /**
     * / Returns all 43 ModelPromotionRecords — frontend promotion dashboard.
     */
    getPromotionSnapshot(): Promise<Array<ModelPromotionRecord>>;
    /**
     * / M0/M1/M2 counts and total proof bundle count.
     */
    getPromotionSummary(): Promise<PromotionSummary>;
    getPublishableReports(): Promise<Array<GeneratedReport>>;
    getRLEngineState(): Promise<{
        alpha: number;
        rewardHistory: Array<number>;
        lawOutcome: Array<number>;
        pathwayBoost: number;
        gamma: number;
        totalReward: number;
        lastReward: number;
        qValues: Array<number>;
    }>;
    /**
     * / How many artifacts are queued for re-ingestion.
     */
    getReingestionQueueDepth(): Promise<bigint>;
    /**
     * / Re-ingestion stats: sealed count, reingested count, world model weight, field state.
     */
    getReingestionStats(): Promise<PipelineStats>;
    /**
     * / Last N rejected intelligence records with proof, newest-first (max 89).
     */
    getRejectionLog(limit: bigint): Promise<Array<RejectionRecord>>;
    getReportEngineState(): Promise<ReportEngineState>;
    /**
     * / Ring 15 closure state — production measured against founding vibration.
     */
    getRing15Status(): Promise<Ring15State>;
    /**
     * / Get which houses a given SDK organism inhabits.
     * / Returns a list of HouseIds — SDK organisms live across multiple houses.
     */
    getSDKOrganismHouses(organism: SDKOrganism): Promise<Array<HouseId>>;
    /**
     * / Current saturation damping state — enabled flag + live saturated node count.
     */
    getSaturationDampingState(): Promise<{
        saturatedCount: bigint;
        enabled: boolean;
    }>;
    /**
     * / Returns the multi-canister sovereign architecture identifier.
     * / CACHE BUST: second new exported symbol, different name, same guarantee.
     */
    getSovereignArchitecture(): Promise<string>;
    /**
     * / Current spike rate in Hz across all 96 neural nodes
     */
    getSpikeRateHz(): Promise<number>;
    getSubstrateMineState(): Promise<SubstrateMineState>;
    getSubstrateVersion(): Promise<string>;
    /**
     * / Third Brain field coherence — enteric sovereignty layer output
     * / Always on. Cannot be overridden. Holds 7 cosmological standing waves.
     */
    getThirdBrainCoherence(): Promise<number>;
    /**
     * / Third Brain 9 cosmological standing wave amplitudes.
     * / These are the permanent standing waves — frequencies never change,
     * / only amplitudes modulate with Kuramoto coherence.
     * / Waves: [Schumann1, Schumann2, Schumann3, Tzolkin, Haab, PHI×Sch, GoldenAngle×Sch, Solfeggio528, Nova432]
     */
    getThirdBrainWaves(): Promise<Array<number>>;
    /**
     * / Total balance in e8s (1 ICP = 100_000_000 e8s).
     */
    getTotalBalanceE8s(): Promise<bigint>;
    /**
     * / The live world model — all 13+ signal sources unified.
     * / Rebuilt every 873ms heartbeat. The organism knowing itself.
     */
    getWorldModel(): Promise<WorldModel>;
    /**
     * / Initialize a sovereign avatar brain chip (Ring 8 sub-instance).
     * / Each avatar gets 6 Kuramoto nodes with golden-angle phase spacing.
     * / avatarId must be in [0, 7]. Returns false if out of range.
     */
    initAvatarBrain(avatarId: bigint): Promise<boolean>;
    injectPerception(threat: number, novelty: number, embodiment: number, social: number): Promise<void>;
    /**
     * / Submit new intelligence for intake. Returns (accepted, record_id).
     * / Accepted truths generate a DeltaRecord with SACESI proof.
     * / Rejected truths generate a RejectionRecord with violation proof.
     */
    intakeIntelligence(content: string, beat: bigint, coherence: number): Promise<[boolean, string]>;
    /**
     * / True if a user message was processed this beat.
     */
    isCognitionUserPresent(): Promise<boolean>;
    /**
     * / True if the genesis ledger entry (10 ICP) has been recorded. (alias)
     */
    isGenesisRecorded(): Promise<boolean>;
    /**
     * / True after the founding moment is permanently sealed.
     */
    isGenesisSealed(): Promise<boolean>;
    /**
     * / True if the genesis ledger entry (10 ICP) has been recorded.
     */
    isLedgerGenesisRecorded(): Promise<boolean>;
    manualMineDeposit(avatarId: string, depositId: bigint): Promise<{
        neurotransmitter: string;
        delta: number;
    } | null>;
    markPuzzleSolved(puzzleId: bigint, timestamp: bigint): Promise<number>;
    /**
     * / Current E8 alignment / octonion field strength [0,1].
     */
    octonionFieldStrength(): Promise<number>;
    presenceCharge(): Promise<void>;
    /**
     * / Quaternion coupling strength between two nodes [0,1].
     */
    quaternionCoupling(node1: bigint, node2: bigint): Promise<number>;
    /**
     * / Record a legacy entry — append-only, never deleted.
     * / Called by every sealing function before it returns.
     */
    recordLegacyEntry(entry: LegacyEntry): Promise<void>;
    /**
     * / Records a proof bundle for a specific model.
     */
    recordModelProof(modelId: string, consumerId: string, coherence: number, lawsPassed: bigint, sacesiHash: string): Promise<void>;
    /**
     * / Requests promotion — adreGateHash must come from the current ADRE deliberation cycle.
     */
    requestModelPromotion(modelId: string, adreGateHash: string): Promise<[boolean, string]>;
    runCombination(compoundA: string, compoundB: string, effectA: number, effectB: number, combinedEffect: number): Promise<CombinationResult>;
    runControlledSession(compoundName: string, dose: number, durationTicks: bigint): Promise<ControlledSessionResult>;
    runDoseResponse(compoundName: string, doses: Array<number>, emax: number, ec50: number, n: number): Promise<DoseResponseResult>;
    runLongitudinal(compoundName: string, sessions: bigint, baseEfficacy: number): Promise<LongitudinalResult>;
    runReceptorMapping(compoundName: string, affinities: Array<[string, number]>): Promise<ReceptorMappingResult>;
    /**
     * / Run one simulation step on a sandbox.
     * / emergenceScore = kuramotoR × fractalDimension × phiCoupling × couplingCoeff / 3.0
     */
    runSandboxStep(sandboxId: bigint): Promise<{
        __kind__: "ok";
        ok: Sandbox;
    } | {
        __kind__: "err";
        err: string;
    }>;
    /**
     * / Seal a new artifact into the re-ingestion pipeline.
     * / Scoring: PHI-weighted composite across 6 quality dimensions.
     * / SACESI proof generated via FNV-1a. Returns the sealed artifact.
     */
    sealArtifact(producer: string, doctrine_alignment: number, phi_coherence: number, narrative_structure: number, emotional_arc: number, actor_performance_delta: number, genesis_alignment: number): Promise<SealedArtifact>;
    /**
     * / Seal an experiment as a sovereign artifact.
     * / Every seal is a financial event on the SACESI proof chain.
     */
    sealExperiment(sandboxId: bigint): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    sealVirtualExperimentArtifact(experimentType: string, avatarId: string, compoundOrPuzzle: string, brainDelta: number, coherenceChange: number, timestamp: bigint): Promise<ExperimentChamberArtifact>;
    setCreatorPrincipal(): Promise<void>;
    setTreasurySignals(btcSig: number, ethSig: number, icpSig: number): Promise<void>;
    /**
     * / Bulk heartbeat proof submission — also callable externally for test harnesses.
     */
    submitHeartbeatProofs(beat: bigint, coherence: number, lawsPassed: bigint): Promise<void>;
    /**
     * / Process a user entry through the 5-pass cognition loop.
     * / Updates world model with user signal (weight = 1.0, highest).
     */
    submitUserEntry(message: string): Promise<CognitionState>;
    /**
     * / Toggle homeostatic tidal return (saturation dampening) on/off.
     */
    toggleSaturationDamping(enabled: boolean): Promise<void>;
    triggerPuzzleGeneration(timestamp: bigint): Promise<CognitivePuzzle | null>;
    updateAvatarMining(avatarId: string, mineralType: string, intensity: number): Promise<boolean>;
}
