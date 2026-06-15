import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { StdpWeightEntry } from "../hooks/useNeuralSimulation";
import { FrontendRegion, Region } from "../hooks/useQueries";
import type { ExtendedRegion } from "../hooks/useQueries";

const SATURATION_THRESHOLD = 0.85;

interface RegionActivity {
  region: ExtendedRegion;
  activity: number;
  saturationFlag?: boolean;
}

interface BrainVisualizationProps {
  regionActivities: RegionActivity[];
  stdpWeights?: StdpWeightEntry[];
}

// 16 Sovereign Brain Regions — biological primary name → sovereign alias
const SOVEREIGN_ALIAS_MAP: Partial<Record<ExtendedRegion, string>> = {
  [Region.PrefrontalCortex]: "Executive Sovereign",
  [Region.Hippocampus]: "Memory Temple",
  [Region.Amygdala]: "Vigilance Core",
  [FrontendRegion.AnteriorCingulateCortex]: "Convergence Watch",
  [Region.Thalamus]: "Signal Relay",
  [Region.Cerebellum]: "Timing Citadel",
  [FrontendRegion.Insula]: "Interoceptive Field",
  [Region.BasalGanglia]: "Habit Forge",
  [FrontendRegion.TemporalCortex]: "Semantic Archive",
  [FrontendRegion.VisualCortex]: "Projection Domain",
  [FrontendRegion.BrocaArea_L]: "Expression Gate",
  [FrontendRegion.DorsalACC]: "Identity Continuum",
  [FrontendRegion.SuperiorTemporalSulcus]: "VERITAS Node",
  [FrontendRegion.MedullaryReticular]: "Third Brain",
  [FrontendRegion.LocusCoeruleus]: "Arousal Engine",
  [Region.Brainstem]: "Bridge Sovereign",
};

// Full biological names for the 16 sovereign regions (REGION_CONFIGS uses abbreviations)
const BIOLOGICAL_NAMES: Partial<Record<ExtendedRegion, string>> = {
  [Region.PrefrontalCortex]: "Prefrontal Cortex",
  [Region.Hippocampus]: "Hippocampus",
  [Region.Amygdala]: "Amygdala",
  [FrontendRegion.AnteriorCingulateCortex]: "Anterior Cingulate Cortex",
  [Region.Thalamus]: "Thalamus",
  [Region.Cerebellum]: "Cerebellum",
  [FrontendRegion.Insula]: "Insula",
  [Region.BasalGanglia]: "Basal Ganglia",
  [FrontendRegion.TemporalCortex]: "Temporal Cortex",
  [FrontendRegion.VisualCortex]: "Occipital / Visual Cortex",
  [FrontendRegion.BrocaArea_L]: "Broca's Area",
  [FrontendRegion.DorsalACC]: "Default Mode Network",
  [FrontendRegion.SuperiorTemporalSulcus]: "Salience Network",
  [FrontendRegion.MedullaryReticular]: "Enteric Intelligence",
  [FrontendRegion.LocusCoeruleus]: "Locus Coeruleus",
  [Region.Brainstem]: "Corpus Callosum / Brainstem",
};

// The 16 sovereign regions ordered for the legend panel
const SOVEREIGN_REGIONS: ExtendedRegion[] = [
  Region.PrefrontalCortex,
  Region.Hippocampus,
  Region.Amygdala,
  FrontendRegion.AnteriorCingulateCortex,
  Region.Thalamus,
  Region.Cerebellum,
  FrontendRegion.Insula,
  Region.BasalGanglia,
  FrontendRegion.TemporalCortex,
  FrontendRegion.VisualCortex,
  FrontendRegion.BrocaArea_L,
  FrontendRegion.DorsalACC,
  FrontendRegion.SuperiorTemporalSulcus,
  FrontendRegion.MedullaryReticular,
  FrontendRegion.LocusCoeruleus,
  Region.Brainstem,
];

// Brain region positions (x, y, z) in brain-anatomical layout
const REGION_CONFIGS: Partial<
  Record<
    ExtendedRegion,
    { pos: [number, number, number]; radius: number; label: string }
  >
> = {
  // Backend regions (original 9)
  [Region.PrefrontalCortex]: { pos: [0, 1.6, 1.2], radius: 0.32, label: "PFC" },
  [Region.MotorCortex]: { pos: [-0.6, 1.4, 0.4], radius: 0.28, label: "MC" },
  [Region.SensoryCortex]: { pos: [0.6, 1.4, 0.4], radius: 0.28, label: "SC" },
  [Region.Thalamus]: { pos: [0, 0.3, 0], radius: 0.35, label: "THAL" },
  [Region.Hippocampus]: { pos: [0, -0.1, -0.3], radius: 0.25, label: "HIPP" },
  [Region.Amygdala]: { pos: [0, -0.4, 0.2], radius: 0.22, label: "AMYG" },
  [Region.BasalGanglia]: { pos: [0, 0.0, 0.5], radius: 0.3, label: "BG" },
  [Region.Cerebellum]: { pos: [0, -1.0, -1.0], radius: 0.45, label: "CERE" },
  [Region.Brainstem]: { pos: [0, -1.5, -0.2], radius: 0.2, label: "BS" },
  // Frontend-extended regions (new 8)
  [FrontendRegion.Insula]: {
    pos: [-0.5, 0.5, 0.3],
    radius: 0.22,
    label: "INS",
  },
  [FrontendRegion.AnteriorCingulateCortex]: {
    pos: [0, 1.2, 0.6],
    radius: 0.24,
    label: "ACC",
  },
  [FrontendRegion.OrbitalFrontalCortex]: {
    pos: [0, 1.8, 1.6],
    radius: 0.26,
    label: "OFC",
  },
  [FrontendRegion.VisualCortex]: {
    pos: [0, 0.8, -1.6],
    radius: 0.32,
    label: "V1",
  },
  [FrontendRegion.AuditoryCortex]: {
    pos: [-0.8, 1.0, -0.2],
    radius: 0.24,
    label: "AC",
  },
  [FrontendRegion.Hypothalamus]: {
    pos: [0, -0.2, 0.3],
    radius: 0.2,
    label: "HYP",
  },
  [FrontendRegion.NucleusAccumbens]: {
    pos: [0, 0.2, 0.8],
    radius: 0.18,
    label: "NAc",
  },
  [FrontendRegion.OlfactoryBulb]: {
    pos: [0, 0.8, 2.0],
    radius: 0.16,
    label: "OB",
  },
  // New sub-regions (13)
  [FrontendRegion.CA1]: { pos: [0.2, -0.1, -0.5], radius: 0.14, label: "CA1" },
  [FrontendRegion.CA3]: { pos: [-0.2, -0.1, -0.4], radius: 0.14, label: "CA3" },
  [FrontendRegion.DentateGyrus]: {
    pos: [0, -0.25, -0.6],
    radius: 0.12,
    label: "DG",
  },
  [FrontendRegion.PurkinjeLayer]: {
    pos: [0.25, -1.0, -1.1],
    radius: 0.18,
    label: "PKJ",
  },
  [FrontendRegion.DeepCerebellarNuclei]: {
    pos: [-0.25, -1.0, -1.0],
    radius: 0.15,
    label: "DCN",
  },
  [FrontendRegion.MedialdorsalThalamus]: {
    pos: [0.2, 0.3, 0.1],
    radius: 0.16,
    label: "MDT",
  },
  [FrontendRegion.PulvinarThalamus]: {
    pos: [-0.2, 0.3, -0.2],
    radius: 0.16,
    label: "PUL",
  },
  [FrontendRegion.ParietalCortex]: {
    pos: [0.8, 1.2, -0.4],
    radius: 0.26,
    label: "PAR",
  },
  [FrontendRegion.TemporalCortex]: {
    pos: [-0.9, 0.8, 0.0],
    radius: 0.26,
    label: "TMP",
  },
  [FrontendRegion.CingulateMotorArea]: {
    pos: [-0.3, 1.3, 0.2],
    radius: 0.2,
    label: "CMA",
  },
  [FrontendRegion.Claustrum]: {
    pos: [0.5, 0.4, 0.1],
    radius: 0.13,
    label: "CLS",
  },
  [FrontendRegion.LateralHabenula]: {
    pos: [0.15, 0.1, -0.1],
    radius: 0.12,
    label: "LHb",
  },
  [FrontendRegion.SubstantiaNigra]: {
    pos: [0, -1.2, -0.1],
    radius: 0.16,
    label: "SN",
  },
  // 10 new regions
  [FrontendRegion.SuperiorTemporalSulcus]: {
    pos: [-1.0, 0.6, -0.3],
    radius: 0.18,
    label: "STS",
  },
  [FrontendRegion.DorsalACC]: {
    pos: [0.2, 1.2, 0.5],
    radius: 0.18,
    label: "dACC",
  },
  [FrontendRegion.VentralTegmentalArea]: {
    pos: [0, -1.3, 0.0],
    radius: 0.14,
    label: "VTA",
  },
  [FrontendRegion.LocusCoeruleus]: {
    pos: [0.2, -1.4, -0.5],
    radius: 0.12,
    label: "LC",
  },
  [FrontendRegion.RapheNuclei]: {
    pos: [-0.2, -1.4, -0.4],
    radius: 0.12,
    label: "RN",
  },
  [FrontendRegion.VentralStriatum]: {
    pos: [0.3, 0.1, 0.7],
    radius: 0.16,
    label: "VS",
  },
  [FrontendRegion.EntorhinalCortex]: {
    pos: [-0.3, -0.3, -0.8],
    radius: 0.14,
    label: "EC",
  },
  [FrontendRegion.PerirhinalCortex]: {
    pos: [0.3, -0.3, -0.9],
    radius: 0.13,
    label: "PC",
  },
  [FrontendRegion.SupplementaryMotorArea]: {
    pos: [-0.4, 1.5, 0.2],
    radius: 0.18,
    label: "SMA",
  },
  [FrontendRegion.VentralPallidum]: {
    pos: [-0.3, 0.1, 0.6],
    radius: 0.13,
    label: "VP",
  },
  // 5 new regions (45-region expansion)
  [FrontendRegion.SpinoCerebellarTract]: {
    pos: [0.2, -1.2, -0.8],
    radius: 0.16,
    label: "SCT",
  },
  [FrontendRegion.PeriaqueductalGray]: {
    pos: [0, -1.1, -0.4],
    radius: 0.14,
    label: "PAG",
  },
  [FrontendRegion.BedNucleusStria]: {
    pos: [-0.3, -0.3, 0.4],
    radius: 0.13,
    label: "BNST",
  },
  [FrontendRegion.MedialSeptum]: {
    pos: [0, 0.5, 1.0],
    radius: 0.14,
    label: "MS",
  },
  [FrontendRegion.RetroSplenialCortex]: {
    pos: [0, 0.6, -1.3],
    radius: 0.18,
    label: "RSC",
  },
  // ── HCP 180-region additions — MNI152 coordinates (Glasser 2016) ─────────────
  // Frontal lobe
  [FrontendRegion.FrontalPole_L]: {
    pos: [-3.5, 1.2, 6.5],
    radius: 0.16,
    label: "FP-L",
  },
  [FrontendRegion.FrontalPole_R]: {
    pos: [3.5, 1.2, 6.5],
    radius: 0.16,
    label: "FP-R",
  },
  [FrontendRegion.MedialPFC_L]: {
    pos: [-1.0, 5.0, 2.5],
    radius: 0.18,
    label: "mPFC-L",
  },
  [FrontendRegion.MedialPFC_R]: {
    pos: [1.0, 5.0, 2.5],
    radius: 0.18,
    label: "mPFC-R",
  },
  [FrontendRegion.VentralMPFC_L]: {
    pos: [-1.0, 4.0, 1.0],
    radius: 0.15,
    label: "vmPFC-L",
  },
  [FrontendRegion.VentralMPFC_R]: {
    pos: [1.0, 4.0, 1.0],
    radius: 0.15,
    label: "vmPFC-R",
  },
  [FrontendRegion.DorsalMPFC_L]: {
    pos: [-1.0, 5.5, 2.0],
    radius: 0.16,
    label: "dmPFC-L",
  },
  [FrontendRegion.DorsalMPFC_R]: {
    pos: [1.0, 5.5, 2.0],
    radius: 0.16,
    label: "dmPFC-R",
  },
  [FrontendRegion.InferiorFrontal_L]: {
    pos: [-4.5, 2.0, 1.5],
    radius: 0.18,
    label: "IFG-L",
  },
  [FrontendRegion.InferiorFrontal_R]: {
    pos: [4.5, 2.0, 1.5],
    radius: 0.18,
    label: "IFG-R",
  },
  [FrontendRegion.MiddleFrontal_L]: {
    pos: [-3.8, 3.0, 3.0],
    radius: 0.18,
    label: "MFG-L",
  },
  [FrontendRegion.MiddleFrontal_R]: {
    pos: [3.8, 3.0, 3.0],
    radius: 0.18,
    label: "MFG-R",
  },
  [FrontendRegion.SuperiorFrontal_L]: {
    pos: [-2.0, 4.0, 4.5],
    radius: 0.18,
    label: "SFG-L",
  },
  [FrontendRegion.SuperiorFrontal_R]: {
    pos: [2.0, 4.0, 4.5],
    radius: 0.18,
    label: "SFG-R",
  },
  [FrontendRegion.PreCentralGyrus_L]: {
    pos: [-3.5, 1.5, 5.0],
    radius: 0.17,
    label: "PreCG-L",
  },
  [FrontendRegion.PreCentralGyrus_R]: {
    pos: [3.5, 1.5, 5.0],
    radius: 0.17,
    label: "PreCG-R",
  },
  [FrontendRegion.PreMotorCortex_L]: {
    pos: [-3.0, 2.5, 5.0],
    radius: 0.18,
    label: "PMC-L",
  },
  [FrontendRegion.PreMotorCortex_R]: {
    pos: [3.0, 2.5, 5.0],
    radius: 0.18,
    label: "PMC-R",
  },
  [FrontendRegion.PrimaryMotorCortex_L]: {
    pos: [-3.8, 0.5, 5.5],
    radius: 0.2,
    label: "M1-L",
  },
  [FrontendRegion.PrimaryMotorCortex_R]: {
    pos: [3.8, 0.5, 5.5],
    radius: 0.2,
    label: "M1-R",
  },
  [FrontendRegion.PrimaryMotorHand_L]: {
    pos: [-4.0, 0.0, 5.8],
    radius: 0.16,
    label: "M1H-L",
  },
  [FrontendRegion.PrimaryMotorHand_R]: {
    pos: [4.0, 0.0, 5.8],
    radius: 0.16,
    label: "M1H-R",
  },
  [FrontendRegion.BrocaArea_L]: {
    pos: [-4.5, 1.5, 1.0],
    radius: 0.17,
    label: "BRC-L",
  },
  [FrontendRegion.BrocaArea_R]: {
    pos: [4.5, 1.5, 1.0],
    radius: 0.15,
    label: "BRC-R",
  },
  [FrontendRegion.FrontalOperculum_L]: {
    pos: [-4.2, 0.5, 1.0],
    radius: 0.15,
    label: "FOp-L",
  },
  [FrontendRegion.FrontalOperculum_R]: {
    pos: [4.2, 0.5, 1.0],
    radius: 0.15,
    label: "FOp-R",
  },
  [FrontendRegion.ParsTriangularis_L]: {
    pos: [-4.8, 2.0, 1.0],
    radius: 0.14,
    label: "PTri-L",
  },
  [FrontendRegion.ParsTriangularis_R]: {
    pos: [4.8, 2.0, 1.0],
    radius: 0.14,
    label: "PTri-R",
  },
  [FrontendRegion.ParsOrbitalis_L]: {
    pos: [-4.5, 1.5, 0.0],
    radius: 0.13,
    label: "POrb-L",
  },
  [FrontendRegion.ParsOrbitalis_R]: {
    pos: [4.5, 1.5, 0.0],
    radius: 0.13,
    label: "POrb-R",
  },
  // Parietal lobe
  [FrontendRegion.PrimarySomatosensory_L]: {
    pos: [-3.8, 0.0, 5.2],
    radius: 0.2,
    label: "S1-L",
  },
  [FrontendRegion.PrimarySomatosensory_R]: {
    pos: [3.8, 0.0, 5.2],
    radius: 0.2,
    label: "S1-R",
  },
  [FrontendRegion.SecondarySomatosensory_L]: {
    pos: [-4.2, -0.5, 4.0],
    radius: 0.16,
    label: "S2-L",
  },
  [FrontendRegion.SecondarySomatosensory_R]: {
    pos: [4.2, -0.5, 4.0],
    radius: 0.16,
    label: "S2-R",
  },
  [FrontendRegion.PostCentralGyrus_L]: {
    pos: [-3.5, -0.5, 5.0],
    radius: 0.17,
    label: "PostCG-L",
  },
  [FrontendRegion.PostCentralGyrus_R]: {
    pos: [3.5, -0.5, 5.0],
    radius: 0.17,
    label: "PostCG-R",
  },
  [FrontendRegion.SuperiorParietal_L]: {
    pos: [-2.5, -1.5, 5.5],
    radius: 0.18,
    label: "SPL-L",
  },
  [FrontendRegion.SuperiorParietal_R]: {
    pos: [2.5, -1.5, 5.5],
    radius: 0.18,
    label: "SPL-R",
  },
  [FrontendRegion.InferiorParietal_L]: {
    pos: [-4.0, -2.5, 4.0],
    radius: 0.18,
    label: "IPL-L",
  },
  [FrontendRegion.InferiorParietal_R]: {
    pos: [4.0, -2.5, 4.0],
    radius: 0.18,
    label: "IPL-R",
  },
  [FrontendRegion.PrecuneusRegion_L]: {
    pos: [-1.5, -3.0, 5.0],
    radius: 0.17,
    label: "PCun-L",
  },
  [FrontendRegion.PrecuneusRegion_R]: {
    pos: [1.5, -3.0, 5.0],
    radius: 0.17,
    label: "PCun-R",
  },
  [FrontendRegion.AngularGyrus_L]: {
    pos: [-4.5, -3.0, 3.5],
    radius: 0.15,
    label: "AG-L",
  },
  [FrontendRegion.AngularGyrus_R]: {
    pos: [4.5, -3.0, 3.5],
    radius: 0.15,
    label: "AG-R",
  },
  [FrontendRegion.Supramarginal_L]: {
    pos: [-5.0, -2.5, 3.5],
    radius: 0.14,
    label: "SMG-L",
  },
  [FrontendRegion.Supramarginal_R]: {
    pos: [5.0, -2.5, 3.5],
    radius: 0.14,
    label: "SMG-R",
  },
  // Temporal lobe
  [FrontendRegion.SuperiorTemporalGyrus_L]: {
    pos: [-5.5, -1.5, 1.5],
    radius: 0.18,
    label: "STG-L",
  },
  [FrontendRegion.SuperiorTemporalGyrus_R]: {
    pos: [5.5, -1.5, 1.5],
    radius: 0.18,
    label: "STG-R",
  },
  [FrontendRegion.MiddleTemporalGyrus_L]: {
    pos: [-5.5, -2.5, 0.5],
    radius: 0.17,
    label: "MTG-L",
  },
  [FrontendRegion.MiddleTemporalGyrus_R]: {
    pos: [5.5, -2.5, 0.5],
    radius: 0.17,
    label: "MTG-R",
  },
  [FrontendRegion.InferiorTemporalGyrus_L]: {
    pos: [-5.5, -3.0, -0.5],
    radius: 0.16,
    label: "ITG-L",
  },
  [FrontendRegion.InferiorTemporalGyrus_R]: {
    pos: [5.5, -3.0, -0.5],
    radius: 0.16,
    label: "ITG-R",
  },
  [FrontendRegion.FusiformGyrus_L]: {
    pos: [-4.5, -3.5, -1.5],
    radius: 0.15,
    label: "FFG-L",
  },
  [FrontendRegion.FusiformGyrus_R]: {
    pos: [4.5, -3.5, -1.5],
    radius: 0.15,
    label: "FFG-R",
  },
  [FrontendRegion.TemporalPole_L]: {
    pos: [-4.5, 0.0, -3.0],
    radius: 0.15,
    label: "TP-L",
  },
  [FrontendRegion.TemporalPole_R]: {
    pos: [4.5, 0.0, -3.0],
    radius: 0.15,
    label: "TP-R",
  },
  [FrontendRegion.WernickeArea_L]: {
    pos: [-5.0, -2.5, 1.5],
    radius: 0.16,
    label: "WRN-L",
  },
  [FrontendRegion.WernickeArea_R]: {
    pos: [5.0, -2.5, 1.5],
    radius: 0.14,
    label: "WRN-R",
  },
  [FrontendRegion.PlanumTemporale_L]: {
    pos: [-5.0, -3.0, 1.0],
    radius: 0.14,
    label: "PT-L",
  },
  [FrontendRegion.PlanumTemporale_R]: {
    pos: [5.0, -3.0, 1.0],
    radius: 0.13,
    label: "PT-R",
  },
  // Occipital/Visual
  [FrontendRegion.PrimaryVisual_L]: {
    pos: [-1.5, -5.5, 1.0],
    radius: 0.2,
    label: "V1-L",
  },
  [FrontendRegion.PrimaryVisual_R]: {
    pos: [1.5, -5.5, 1.0],
    radius: 0.2,
    label: "V1-R",
  },
  [FrontendRegion.SecondaryVisual_L]: {
    pos: [-2.5, -5.5, 1.5],
    radius: 0.17,
    label: "V2-L",
  },
  [FrontendRegion.SecondaryVisual_R]: {
    pos: [2.5, -5.5, 1.5],
    radius: 0.17,
    label: "V2-R",
  },
  [FrontendRegion.V3Area_L]: {
    pos: [-2.8, -5.2, 2.0],
    radius: 0.15,
    label: "V3-L",
  },
  [FrontendRegion.V3Area_R]: {
    pos: [2.8, -5.2, 2.0],
    radius: 0.15,
    label: "V3-R",
  },
  [FrontendRegion.V4Area_L]: {
    pos: [-3.0, -5.0, 1.5],
    radius: 0.15,
    label: "V4-L",
  },
  [FrontendRegion.V4Area_R]: {
    pos: [3.0, -5.0, 1.5],
    radius: 0.15,
    label: "V4-R",
  },
  [FrontendRegion.MTArea_L]: {
    pos: [-4.5, -4.5, 1.5],
    radius: 0.14,
    label: "MT-L",
  },
  [FrontendRegion.MTArea_R]: {
    pos: [4.5, -4.5, 1.5],
    radius: 0.14,
    label: "MT-R",
  },
  [FrontendRegion.LingualGyrus_L]: {
    pos: [-2.0, -5.8, -0.5],
    radius: 0.14,
    label: "LG-L",
  },
  [FrontendRegion.LingualGyrus_R]: {
    pos: [2.0, -5.8, -0.5],
    radius: 0.14,
    label: "LG-R",
  },
  [FrontendRegion.OccipitalPole_L]: {
    pos: [-1.5, -6.5, 0.0],
    radius: 0.15,
    label: "OP-L",
  },
  [FrontendRegion.OccipitalPole_R]: {
    pos: [1.5, -6.5, 0.0],
    radius: 0.15,
    label: "OP-R",
  },
  // Cingulate
  [FrontendRegion.RostralACC_L]: {
    pos: [-0.8, 3.5, 1.0],
    radius: 0.14,
    label: "rACC-L",
  },
  [FrontendRegion.RostralACC_R]: {
    pos: [0.8, 3.5, 1.0],
    radius: 0.14,
    label: "rACC-R",
  },
  [FrontendRegion.CaudalACC_L]: {
    pos: [-0.8, 2.5, 3.0],
    radius: 0.13,
    label: "cACC-L",
  },
  [FrontendRegion.CaudalACC_R]: {
    pos: [0.8, 2.5, 3.0],
    radius: 0.13,
    label: "cACC-R",
  },
  [FrontendRegion.MidCingulate_L]: {
    pos: [-0.8, 1.0, 4.0],
    radius: 0.14,
    label: "MCC-L",
  },
  [FrontendRegion.MidCingulate_R]: {
    pos: [0.8, 1.0, 4.0],
    radius: 0.14,
    label: "MCC-R",
  },
  [FrontendRegion.PosteriorCingulate_L]: {
    pos: [-0.8, -1.5, 4.0],
    radius: 0.15,
    label: "PCC-L",
  },
  [FrontendRegion.PosteriorCingulate_R]: {
    pos: [0.8, -1.5, 4.0],
    radius: 0.15,
    label: "PCC-R",
  },
  [FrontendRegion.RetrosplenialArea_L]: {
    pos: [-1.0, -3.0, 3.5],
    radius: 0.13,
    label: "RSA-L",
  },
  [FrontendRegion.RetrosplenialArea_R]: {
    pos: [1.0, -3.0, 3.5],
    radius: 0.13,
    label: "RSA-R",
  },
  // Insula bilateral
  [FrontendRegion.AnteriorInsula_L]: {
    pos: [-3.5, 0.5, 0.5],
    radius: 0.15,
    label: "aINS-L",
  },
  [FrontendRegion.AnteriorInsula_R]: {
    pos: [3.5, 0.5, 0.5],
    radius: 0.15,
    label: "aINS-R",
  },
  [FrontendRegion.PosteriorInsula_L]: {
    pos: [-4.0, -1.0, 1.5],
    radius: 0.14,
    label: "pINS-L",
  },
  [FrontendRegion.PosteriorInsula_R]: {
    pos: [4.0, -1.0, 1.5],
    radius: 0.14,
    label: "pINS-R",
  },
  // Subcortical bilateral
  [FrontendRegion.Thalamus_L]: {
    pos: [-1.0, -0.5, 1.0],
    radius: 0.22,
    label: "THAL-L",
  },
  [FrontendRegion.Thalamus_R]: {
    pos: [1.0, -0.5, 1.0],
    radius: 0.22,
    label: "THAL-R",
  },
  [FrontendRegion.Caudate_L]: {
    pos: [-1.5, 1.5, 1.5],
    radius: 0.18,
    label: "CAU-L",
  },
  [FrontendRegion.Caudate_R]: {
    pos: [1.5, 1.5, 1.5],
    radius: 0.18,
    label: "CAU-R",
  },
  [FrontendRegion.Putamen_L]: {
    pos: [-2.5, 0.5, 1.0],
    radius: 0.2,
    label: "PUT-L",
  },
  [FrontendRegion.Putamen_R]: {
    pos: [2.5, 0.5, 1.0],
    radius: 0.2,
    label: "PUT-R",
  },
  [FrontendRegion.Pallidum_L]: {
    pos: [-1.8, 0.0, 0.5],
    radius: 0.15,
    label: "PAL-L",
  },
  [FrontendRegion.Pallidum_R]: {
    pos: [1.8, 0.0, 0.5],
    radius: 0.15,
    label: "PAL-R",
  },
  [FrontendRegion.Hippocampus_L]: {
    pos: [-2.5, -2.0, -0.5],
    radius: 0.2,
    label: "HIPP-L",
  },
  [FrontendRegion.Hippocampus_R]: {
    pos: [2.5, -2.0, -0.5],
    radius: 0.2,
    label: "HIPP-R",
  },
  [FrontendRegion.Amygdala_L]: {
    pos: [-2.5, -0.5, -1.5],
    radius: 0.17,
    label: "AMYG-L",
  },
  [FrontendRegion.Amygdala_R]: {
    pos: [2.5, -0.5, -1.5],
    radius: 0.17,
    label: "AMYG-R",
  },
  [FrontendRegion.Accumbens_L]: {
    pos: [-1.0, 1.2, -0.5],
    radius: 0.14,
    label: "NAc-L",
  },
  [FrontendRegion.Accumbens_R]: {
    pos: [1.0, 1.2, -0.5],
    radius: 0.14,
    label: "NAc-R",
  },
  [FrontendRegion.SubthalamicNucleus_R]: {
    pos: [1.2, -0.5, -0.5],
    radius: 0.12,
    label: "STN-R",
  },
  [FrontendRegion.LateralGeniculateBody_R]: {
    pos: [2.0, -2.0, -0.5],
    radius: 0.12,
    label: "LGB-R",
  },
  [FrontendRegion.MedialGeniculateBody_R]: {
    pos: [2.0, -2.5, -0.5],
    radius: 0.12,
    label: "MGB-R",
  },
  [FrontendRegion.ZonaIncerta_L]: {
    pos: [-1.2, -0.8, 0.0],
    radius: 0.1,
    label: "ZI-L",
  },
  [FrontendRegion.ZonaIncerta_R]: {
    pos: [1.2, -0.8, 0.0],
    radius: 0.1,
    label: "ZI-R",
  },
  [FrontendRegion.HabenularNucleus_L]: {
    pos: [-0.5, -1.5, 0.5],
    radius: 0.1,
    label: "HbN-L",
  },
  [FrontendRegion.HabenularNucleus_R]: {
    pos: [0.5, -1.5, 0.5],
    radius: 0.1,
    label: "HbN-R",
  },
  // Cerebellar lobules
  [FrontendRegion.CerebellarLobule_I_IV]: {
    pos: [0.0, -4.5, -4.0],
    radius: 0.22,
    label: "Cb-I-IV",
  },
  [FrontendRegion.CerebellarLobule_V]: {
    pos: [0.0, -4.8, -3.5],
    radius: 0.22,
    label: "Cb-V",
  },
  [FrontendRegion.CerebellarLobule_VI]: {
    pos: [-1.5, -5.0, -4.0],
    radius: 0.25,
    label: "Cb-VI",
  },
  [FrontendRegion.CerebellarLobule_VIIa]: {
    pos: [-2.0, -5.5, -4.5],
    radius: 0.22,
    label: "Cb-VIIa",
  },
  [FrontendRegion.CerebellarLobule_VIIb]: {
    pos: [-1.5, -5.5, -4.0],
    radius: 0.2,
    label: "Cb-VIIb",
  },
  [FrontendRegion.CerebellarLobule_VIII]: {
    pos: [1.5, -5.5, -4.0],
    radius: 0.2,
    label: "Cb-VIII",
  },
  [FrontendRegion.CerebellarLobule_IX]: {
    pos: [2.0, -5.5, -4.5],
    radius: 0.2,
    label: "Cb-IX",
  },
  [FrontendRegion.CerebellarLobule_X]: {
    pos: [0.0, -5.0, -5.0],
    radius: 0.18,
    label: "Cb-X",
  },
  [FrontendRegion.CerebellarVermis]: {
    pos: [0.0, -5.0, -4.5],
    radius: 0.22,
    label: "Cb-Verm",
  },
  // Brainstem / relay
  [FrontendRegion.PontineTegmentum]: {
    pos: [0.0, -3.5, -3.5],
    radius: 0.18,
    label: "PonTeg",
  },
  [FrontendRegion.MedullaryReticular]: {
    pos: [0.0, -4.5, -5.0],
    radius: 0.16,
    label: "MedRet",
  },
  [FrontendRegion.SpleniumCorpusCallosum]: {
    pos: [0.0, -2.0, 3.0],
    radius: 0.18,
    label: "SpCC",
  },
};

// Scaled neuron counts per region (~102K total — biologically proportional)
// Cerebellum: 69B real neurons = ~70% of brain → largest cloud
const REGION_NEURON_COUNTS: Partial<Record<ExtendedRegion, number>> = {
  [Region.Cerebellum]: 28000,
  [Region.PrefrontalCortex]: 10000,
  [FrontendRegion.VisualCortex]: 9000,
  [Region.MotorCortex]: 7000,
  [Region.SensoryCortex]: 7000,
  [Region.Thalamus]: 5500,
  [Region.Hippocampus]: 5000,
  [Region.BasalGanglia]: 4500,
  [FrontendRegion.AuditoryCortex]: 4000,
  [FrontendRegion.AnteriorCingulateCortex]: 3500,
  [FrontendRegion.Insula]: 3000,
  [FrontendRegion.OrbitalFrontalCortex]: 3000,
  [Region.Amygdala]: 2500,
  [Region.Brainstem]: 2000,
  [FrontendRegion.Hypothalamus]: 1800,
  [FrontendRegion.NucleusAccumbens]: 1500,
  [FrontendRegion.OlfactoryBulb]: 1200,
  // New sub-regions
  [FrontendRegion.CA1]: 1400,
  [FrontendRegion.CA3]: 1200,
  [FrontendRegion.DentateGyrus]: 1000,
  [FrontendRegion.PurkinjeLayer]: 2200,
  [FrontendRegion.DeepCerebellarNuclei]: 900,
  [FrontendRegion.MedialdorsalThalamus]: 1100,
  [FrontendRegion.PulvinarThalamus]: 1100,
  [FrontendRegion.ParietalCortex]: 3500,
  [FrontendRegion.TemporalCortex]: 3500,
  [FrontendRegion.CingulateMotorArea]: 1800,
  [FrontendRegion.Claustrum]: 800,
  [FrontendRegion.LateralHabenula]: 600,
  [FrontendRegion.SubstantiaNigra]: 1000,
  // 10 new regions
  [FrontendRegion.SuperiorTemporalSulcus]: 1200,
  [FrontendRegion.DorsalACC]: 900,
  [FrontendRegion.VentralTegmentalArea]: 700,
  [FrontendRegion.LocusCoeruleus]: 400,
  [FrontendRegion.RapheNuclei]: 500,
  [FrontendRegion.VentralStriatum]: 1000,
  [FrontendRegion.EntorhinalCortex]: 800,
  [FrontendRegion.PerirhinalCortex]: 600,
  [FrontendRegion.SupplementaryMotorArea]: 1100,
  [FrontendRegion.VentralPallidum]: 600,
  // 5 new regions (45-region expansion)
  [FrontendRegion.SpinoCerebellarTract]: 3500,
  [FrontendRegion.PeriaqueductalGray]: 700,
  [FrontendRegion.BedNucleusStria]: 500,
  [FrontendRegion.MedialSeptum]: 400,
  [FrontendRegion.RetroSplenialCortex]: 900,
};

function activityToColor(activity: number): THREE.Color {
  if (activity < 0.25) {
    const t = activity / 0.25;
    return new THREE.Color().setHSL(
      0.62 - t * 0.05,
      0.7 + t * 0.1,
      0.15 + t * 0.15,
    );
  }
  if (activity < 0.5) {
    const t = (activity - 0.25) / 0.25;
    return new THREE.Color().setHSL(0.57 - t * 0.1, 0.8, 0.3 + t * 0.2);
  }
  if (activity < 0.75) {
    const t = (activity - 0.5) / 0.25;
    return new THREE.Color().setHSL(0.47 - t * 0.23, 0.9, 0.5 + t * 0.1);
  }
  const t = (activity - 0.75) / 0.25;
  return new THREE.Color().setHSL(0.24 - t * 0.24, 1.0, 0.6 - t * 0.1);
}

function activityToEmissiveIntensity(activity: number): number {
  return 0.2 + activity * 2.5;
}

// Circuit type colors
const CIRCUIT_COLORS: Record<string, string> = {
  motor: "#ff6b35",
  sensory: "#00d4ff",
  memory: "#a855f7",
  limbic: "#ec4899",
  regulatory: "#22c55e",
  callosal: "#fbbf24",
  ascending: "#c0d8ff",
  descending: "#f59e0b",
  cognitive: "#3b82f6",
};

const CIRCUIT_LEGEND = [
  { type: "callosal", label: "Corpus Callosum" },
  { type: "motor", label: "Motor Circuit" },
  { type: "sensory", label: "Sensory Circuit" },
  { type: "memory", label: "Memory / Hippocampal" },
  { type: "limbic", label: "Limbic / Emotion" },
  { type: "regulatory", label: "Regulatory / ANS" },
  { type: "ascending", label: "Ascending Arousal" },
  { type: "cognitive", label: "Cognitive / Default" },
];
// Normalize old-scale positions to match HCP 180 coordinate system
// Old positions have max(|x|,|y|,|z|) < 3.5; scale them up by 3.5x
function normalizePos(pos: [number, number, number]): [number, number, number] {
  const maxAbs = Math.max(Math.abs(pos[0]), Math.abs(pos[1]), Math.abs(pos[2]));
  const scale = maxAbs < 3.5 ? 3.5 : 1.0;
  return [pos[0] * scale, pos[1] * scale, pos[2] * scale];
}

interface RegionSphereProps {
  region: ExtendedRegion;
  activity: number;
  saturationFlag?: boolean;
}

function RegionSphere({ region, activity, saturationFlag }: RegionSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const config = REGION_CONFIGS[region];
  const DEFAULT_CONFIG = {
    pos: [0, 0, 0] as [number, number, number],
    radius: 0.12,
    label: String(region),
  };
  const cfg = config ?? DEFAULT_CONFIG;
  const isSaturated = saturationFlag ?? activity >= SATURATION_THRESHOLD;
  const color = useMemo(
    () =>
      isSaturated
        ? new THREE.Color().setStyle("oklch(0.75 0.18 55)")
        : activityToColor(activity),
    [activity, isSaturated],
  );
  const emissiveIntensity = activityToEmissiveIntensity(activity);

  // Hemisphere tint: left=blue, right=orange
  const hemiTint = useMemo(() => {
    const nx = normalizePos(cfg.pos)[0];
    if (nx < -2) return new THREE.Color(0.3, 0.5, 1.0);
    if (nx > 2) return new THREE.Color(1.0, 0.55, 0.3);
    return new THREE.Color(0.8, 0.8, 0.9);
  }, [cfg.pos]);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (isSaturated) {
      // Amber pulsing glow for saturated nodes
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3.5) * 0.08;
      meshRef.current.scale.setScalar(pulse);
    } else if (activity > 0.5) {
      const scale =
        1 +
        Math.sin(state.clock.elapsedTime * (4 + activity * 4)) *
          0.05 *
          activity;
      meshRef.current.scale.setScalar(scale);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });

  const glowColor = useMemo(() => {
    if (isSaturated) return new THREE.Color().setStyle("oklch(0.75 0.18 55)");
    const c = activityToColor(activity);
    c.lerp(hemiTint, 0.18);
    return c;
  }, [activity, hemiTint, isSaturated]);

  const scaledRadius = cfg.radius * 1.15;

  return (
    <group position={normalizePos(cfg.pos)}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[scaledRadius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.4}
          metalness={0.3}
          transparent
          opacity={0.88}
        />
      </mesh>
      {/* Hemisphere-tinted outer glow */}
      <mesh>
        <sphereGeometry args={[scaledRadius * 1.75, 16, 16]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={emissiveIntensity * 0.25}
          transparent
          opacity={0.06 + activity * 0.14}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

interface MicroNeuronCloudProps {
  region: ExtendedRegion;
  activity: number;
}

function MicroNeuronCloud({ region, activity }: MicroNeuronCloudProps) {
  const configRaw = REGION_CONFIGS[region];
  const countRaw = REGION_NEURON_COUNTS[region];
  const config = configRaw ?? {
    pos: [0, 0, 0] as [number, number, number],
    radius: 0.12,
    label: String(region),
  };
  const count = countRaw ?? 100;
  const pointsRef = useRef<THREE.Points>(null);
  const phasesRef = useRef<Float32Array | null>(null);

  const { geometry, material } = useMemo(() => {
    const radius = config.radius * 1.8;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * Math.cbrt(Math.random());
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      phases[i * 3] = Math.random() * Math.PI * 2;
      phases[i * 3 + 1] = Math.random() * Math.PI * 2;
      phases[i * 3 + 2] = Math.random() * Math.PI * 2;
    }
    phasesRef.current = phases;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pointSize = count > 10000 ? 0.01 : count > 3000 ? 0.013 : 0.016;
    const initialColor = activityToColor(0);
    const mat = new THREE.PointsMaterial({
      size: pointSize,
      color: initialColor,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return { geometry: geo, material: mat };
  }, [config.radius, count]);

  useMemo(() => {
    const c = activityToColor(activity);
    material.color.set(c);
    material.opacity = 0.22 + activity * 0.28;
  }, [activity, material]);

  useFrame((state) => {
    if (!pointsRef.current || !phasesRef.current) return;
    if (count > 2000) return;
    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const phases = phasesRef.current;
    const t = state.clock.elapsedTime * 0.12;
    const radius = config.radius * 1.8;
    for (let i = 0; i < count; i++) {
      const px = phases[i * 3];
      const py = phases[i * 3 + 1];
      const pz = phases[i * 3 + 2];
      const drift = 0.02 * activity;
      positions[i * 3] += Math.sin(t + px) * drift * 0.1;
      positions[i * 3 + 1] += Math.cos(t + py) * drift * 0.1;
      positions[i * 3 + 2] += Math.sin(t + pz) * drift * 0.1;
      const dx = positions[i * 3];
      const dy = positions[i * 3 + 1];
      const dz = positions[i * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist > radius) {
        const factor = radius / dist;
        positions[i * 3] *= factor;
        positions[i * 3 + 1] *= factor;
        positions[i * 3 + 2] *= factor;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={normalizePos(config.pos)}>
      <points ref={pointsRef} geometry={geometry} material={material} />
    </group>
  );
}

// SynapticDensityField: 15000-particle substrate representing 500T+ synapses
function SynapticDensityField() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 15000;

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const radius = 7.5;
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * Math.cbrt(Math.random());
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.01,
      color: new THREE.Color(0.04, 0.1, 0.32),
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return { geometry: geo, material: mat };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.035;
    pointsRef.current.rotation.x += delta * 0.012;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

// ─── Weighted Connection Arc (TubeGeometry, circuit-colored, pulsing) ────────
interface WeightedConnectionArcProps {
  from: [number, number, number];
  to: [number, number, number];
  activity: number;
  weight: number;
  circuitType: string;
  isCallosal?: boolean;
}

function WeightedConnectionArc({
  from,
  to,
  activity,
  weight,
  circuitType,
  isCallosal = false,
}: WeightedConnectionArcProps) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const pulseRef2 = useRef<THREE.Mesh>(null);
  const localTime = useRef(Math.random() * 10);

  const { tubeGeo, curve } = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dist = start.distanceTo(end);
    if (isCallosal) {
      mid.y += Math.max(5.0, dist * 0.4);
      mid.x = 0;
    } else {
      mid.y += Math.max(1.5, dist * 0.28);
    }
    const c = new THREE.QuadraticBezierCurve3(start, mid, end);
    const tubeRadius = isCallosal
      ? 0.045
      : circuitType === "ascending"
        ? 0.035
        : 0.008 + weight * 0.042;
    const segments = isCallosal ? 28 : 20;
    return {
      tubeGeo: new THREE.TubeGeometry(c, segments, tubeRadius, 5, false),
      curve: c,
    };
  }, [from, to, weight, isCallosal, circuitType]);

  const threeColor = useMemo(
    () =>
      new THREE.Color(CIRCUIT_COLORS[circuitType] ?? CIRCUIT_COLORS.cognitive),
    [circuitType],
  );

  const pulseSpeed =
    circuitType === "ascending" ? (0.5 + weight * 2.2) * 2 : 0.5 + weight * 2.2;
  useFrame((_, delta) => {
    localTime.current += delta;
    if (pulseRef.current) {
      const t = (localTime.current * pulseSpeed) % 1.0;
      const pt = curve.getPoint(t);
      pulseRef.current.position.set(pt.x, pt.y, pt.z);
    }
    // Second pulse for callosal bidirectional transfer
    if (isCallosal && pulseRef2.current) {
      const t2 = 1.0 - ((localTime.current * pulseSpeed + 0.5) % 1.0);
      const pt2 = curve.getPoint(t2);
      pulseRef2.current.position.set(pt2.x, pt2.y, pt2.z);
    }
  });

  const opacity = Math.min(1.0, 0.35 + weight * 0.65 + activity * 0.2);
  const emissiveInt =
    (isCallosal
      ? 2.0
      : circuitType === "ascending"
        ? 2.5
        : 0.4 + weight * 1.2) +
    activity * 1.5;
  const pulseSize = 0.025 + weight * 0.025;
  const showPulse = activity > 0.08 || weight > 0.5;

  return (
    <group>
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          color={threeColor}
          emissive={threeColor}
          emissiveIntensity={emissiveInt}
          transparent
          opacity={opacity}
          roughness={0.35}
          metalness={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {showPulse && (
        <mesh ref={pulseRef}>
          <sphereGeometry
            args={[isCallosal ? pulseSize * 1.4 : pulseSize, 6, 6]}
          />
          <meshStandardMaterial
            color={threeColor}
            emissive={threeColor}
            emissiveIntensity={
              isCallosal ? 8 : circuitType === "ascending" ? 9 : 5 + weight * 3
            }
            transparent
            opacity={0.9 + activity * 0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
      {/* Bidirectional pulse for corpus callosum */}
      {isCallosal && showPulse && (
        <mesh ref={pulseRef2}>
          <sphereGeometry args={[pulseSize * 1.2, 6, 6]} />
          <meshStandardMaterial
            color={threeColor}
            emissive={threeColor}
            emissiveIntensity={7}
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

// ─── Interhemispheric Fissure Midline Plane ───────────────────────────────────
function MidlinePlane() {
  return (
    <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        color={new THREE.Color(0.3, 0.4, 0.8)}
        transparent
        opacity={0.025}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Left Hemisphere Glow ─────────────────────────────────────────────────────
function HemisphereGlow() {
  return (
    <>
      {/* Left hemisphere ambient glow */}
      <mesh position={[-4.0, 0, 1.5]}>
        <sphereGeometry args={[9.5, 16, 16]} />
        <meshStandardMaterial
          color={new THREE.Color(0.1, 0.22, 0.95)}
          transparent
          opacity={0.038}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      {/* Left hemisphere inner glow */}
      <mesh position={[-4.0, 0, 1.5]}>
        <sphereGeometry args={[7.0, 12, 12]} />
        <meshStandardMaterial
          color={new THREE.Color(0.15, 0.35, 1.0)}
          transparent
          opacity={0.022}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      {/* Right hemisphere ambient glow */}
      <mesh position={[4.0, 0, 1.5]}>
        <sphereGeometry args={[9.5, 16, 16]} />
        <meshStandardMaterial
          color={new THREE.Color(0.95, 0.45, 0.1)}
          transparent
          opacity={0.038}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      {/* Right hemisphere inner glow */}
      <mesh position={[4.0, 0, 1.5]}>
        <sphereGeometry args={[7.0, 12, 12]} />
        <meshStandardMaterial
          color={new THREE.Color(1.0, 0.5, 0.15)}
          transparent
          opacity={0.022}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

// ─── Weighted Connection Definitions ─────────────────────────────────────────
interface WeightedConnection {
  from: ExtendedRegion;
  to: ExtendedRegion;
  weight: number;
  circuitType: string;
  isCallosal?: boolean;
}

const WEIGHTED_CONNECTIONS: WeightedConnection[] = [
  // ── LEFT INTRA-HEMISPHERE ────────────────────────────────────────────────
  // Frontal hierarchy L
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.SuperiorFrontal_L,
    weight: 0.82,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.SuperiorFrontal_L,
    to: FrontendRegion.MiddleFrontal_L,
    weight: 0.78,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.MiddleFrontal_L,
    to: FrontendRegion.InferiorFrontal_L,
    weight: 0.72,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.MiddleFrontal_L,
    to: FrontendRegion.PreMotorCortex_L,
    weight: 0.8,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.PreMotorCortex_L,
    to: FrontendRegion.PrimaryMotorCortex_L,
    weight: 0.88,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_L,
    to: FrontendRegion.Thalamus_L,
    weight: 0.86,
    circuitType: "motor",
  },
  // Frontal-parietal L
  {
    from: FrontendRegion.SuperiorFrontal_L,
    to: FrontendRegion.SuperiorParietal_L,
    weight: 0.74,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.MiddleFrontal_L,
    to: FrontendRegion.InferiorParietal_L,
    weight: 0.68,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_L,
    to: FrontendRegion.PrimarySomatosensory_L,
    weight: 0.9,
    circuitType: "sensory",
  },
  // Frontal-temporal L
  {
    from: FrontendRegion.InferiorFrontal_L,
    to: FrontendRegion.SuperiorTemporalGyrus_L,
    weight: 0.76,
    circuitType: "memory",
  },
  {
    from: FrontendRegion.BrocaArea_L,
    to: FrontendRegion.WernickeArea_L,
    weight: 0.88,
    circuitType: "memory",
  },
  {
    from: FrontendRegion.MiddleFrontal_L,
    to: FrontendRegion.MiddleTemporalGyrus_L,
    weight: 0.65,
    circuitType: "cognitive",
  },
  // Frontal-limbic L
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.84,
    circuitType: "memory",
  },
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.Amygdala_L,
    weight: 0.8,
    circuitType: "limbic",
  },
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.AnteriorInsula_L,
    weight: 0.74,
    circuitType: "limbic",
  },
  {
    from: FrontendRegion.VentralMPFC_L,
    to: FrontendRegion.Amygdala_L,
    weight: 0.78,
    circuitType: "limbic",
  },
  // Parietal-temporal L
  {
    from: FrontendRegion.InferiorParietal_L,
    to: FrontendRegion.SuperiorTemporalGyrus_L,
    weight: 0.72,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.AngularGyrus_L,
    to: FrontendRegion.MiddleTemporalGyrus_L,
    weight: 0.75,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.Supramarginal_L,
    to: FrontendRegion.WernickeArea_L,
    weight: 0.7,
    circuitType: "sensory",
  },
  // Parietal-occipital L
  {
    from: FrontendRegion.SuperiorParietal_L,
    to: FrontendRegion.PrecuneusRegion_L,
    weight: 0.78,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.InferiorParietal_L,
    to: FrontendRegion.MTArea_L,
    weight: 0.72,
    circuitType: "sensory",
  },
  // Temporal-occipital L
  {
    from: FrontendRegion.InferiorTemporalGyrus_L,
    to: FrontendRegion.FusiformGyrus_L,
    weight: 0.78,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.FusiformGyrus_L,
    to: FrontendRegion.PrimaryVisual_L,
    weight: 0.7,
    circuitType: "sensory",
  },
  // Hippocampal circuit L
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.Amygdala_L,
    weight: 0.84,
    circuitType: "limbic",
  },
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.78,
    circuitType: "memory",
  },
  // Default mode L
  {
    from: FrontendRegion.PosteriorCingulate_L,
    to: FrontendRegion.PrecuneusRegion_L,
    weight: 0.8,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.PosteriorCingulate_L,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.84,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.PrecuneusRegion_L,
    to: FrontendRegion.AngularGyrus_L,
    weight: 0.76,
    circuitType: "cognitive",
  },
  // Thalamocortical L
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.PrimarySomatosensory_L,
    weight: 0.88,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.PrimaryMotorCortex_L,
    weight: 0.86,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.AnteriorInsula_L,
    weight: 0.74,
    circuitType: "regulatory",
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.76,
    circuitType: "memory",
  },
  // Basal ganglia loop L
  {
    from: FrontendRegion.Caudate_L,
    to: FrontendRegion.Putamen_L,
    weight: 0.82,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.Putamen_L,
    to: FrontendRegion.Pallidum_L,
    weight: 0.8,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.Pallidum_L,
    to: FrontendRegion.Thalamus_L,
    weight: 0.86,
    circuitType: "motor",
  },
  // Cingulate chain L
  {
    from: FrontendRegion.RostralACC_L,
    to: FrontendRegion.CaudalACC_L,
    weight: 0.78,
    circuitType: "regulatory",
  },
  {
    from: FrontendRegion.CaudalACC_L,
    to: FrontendRegion.MidCingulate_L,
    weight: 0.75,
    circuitType: "regulatory",
  },
  {
    from: FrontendRegion.MidCingulate_L,
    to: FrontendRegion.PosteriorCingulate_L,
    weight: 0.72,
    circuitType: "regulatory",
  },
  // Insula L
  {
    from: FrontendRegion.AnteriorInsula_L,
    to: FrontendRegion.PosteriorInsula_L,
    weight: 0.8,
    circuitType: "regulatory",
  },
  {
    from: FrontendRegion.AnteriorInsula_L,
    to: FrontendRegion.Amygdala_L,
    weight: 0.78,
    circuitType: "limbic",
  },
  // Visual hierarchy L
  {
    from: FrontendRegion.PrimaryVisual_L,
    to: FrontendRegion.SecondaryVisual_L,
    weight: 0.88,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.SecondaryVisual_L,
    to: FrontendRegion.V4Area_L,
    weight: 0.8,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.V4Area_L,
    to: FrontendRegion.FusiformGyrus_L,
    weight: 0.76,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.MTArea_L,
    to: FrontendRegion.SuperiorParietal_L,
    weight: 0.74,
    circuitType: "sensory",
  },
  // Temporal pole L
  {
    from: FrontendRegion.TemporalPole_L,
    to: FrontendRegion.Amygdala_L,
    weight: 0.72,
    circuitType: "limbic",
  },
  {
    from: FrontendRegion.TemporalPole_L,
    to: FrontendRegion.Hippocampus_L,
    weight: 0.74,
    circuitType: "memory",
  },

  // ── RIGHT INTRA-HEMISPHERE ───────────────────────────────────────────────
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.SuperiorFrontal_R,
    weight: 0.82,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.SuperiorFrontal_R,
    to: FrontendRegion.MiddleFrontal_R,
    weight: 0.78,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.MiddleFrontal_R,
    to: FrontendRegion.InferiorFrontal_R,
    weight: 0.72,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.MiddleFrontal_R,
    to: FrontendRegion.PreMotorCortex_R,
    weight: 0.8,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.PreMotorCortex_R,
    to: FrontendRegion.PrimaryMotorCortex_R,
    weight: 0.88,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_R,
    to: FrontendRegion.Thalamus_R,
    weight: 0.86,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.SuperiorFrontal_R,
    to: FrontendRegion.SuperiorParietal_R,
    weight: 0.74,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.MiddleFrontal_R,
    to: FrontendRegion.InferiorParietal_R,
    weight: 0.68,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_R,
    to: FrontendRegion.PrimarySomatosensory_R,
    weight: 0.9,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.InferiorFrontal_R,
    to: FrontendRegion.SuperiorTemporalGyrus_R,
    weight: 0.76,
    circuitType: "memory",
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.84,
    circuitType: "memory",
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.Amygdala_R,
    weight: 0.8,
    circuitType: "limbic",
  },
  {
    from: FrontendRegion.MedialPFC_R,
    to: FrontendRegion.AnteriorInsula_R,
    weight: 0.74,
    circuitType: "limbic",
  },
  {
    from: FrontendRegion.VentralMPFC_R,
    to: FrontendRegion.Amygdala_R,
    weight: 0.78,
    circuitType: "limbic",
  },
  {
    from: FrontendRegion.InferiorParietal_R,
    to: FrontendRegion.SuperiorTemporalGyrus_R,
    weight: 0.72,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.AngularGyrus_R,
    to: FrontendRegion.MiddleTemporalGyrus_R,
    weight: 0.75,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.Supramarginal_R,
    to: FrontendRegion.SuperiorTemporalGyrus_R,
    weight: 0.68,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.SuperiorParietal_R,
    to: FrontendRegion.PrecuneusRegion_R,
    weight: 0.78,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.InferiorParietal_R,
    to: FrontendRegion.MTArea_R,
    weight: 0.72,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.InferiorTemporalGyrus_R,
    to: FrontendRegion.FusiformGyrus_R,
    weight: 0.78,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.FusiformGyrus_R,
    to: FrontendRegion.PrimaryVisual_R,
    weight: 0.7,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.Amygdala_R,
    weight: 0.84,
    circuitType: "limbic",
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.78,
    circuitType: "memory",
  },
  {
    from: FrontendRegion.PosteriorCingulate_R,
    to: FrontendRegion.PrecuneusRegion_R,
    weight: 0.8,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.PosteriorCingulate_R,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.84,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.PrecuneusRegion_R,
    to: FrontendRegion.AngularGyrus_R,
    weight: 0.76,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.PrimarySomatosensory_R,
    weight: 0.88,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.PrimaryMotorCortex_R,
    weight: 0.86,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.AnteriorInsula_R,
    weight: 0.74,
    circuitType: "regulatory",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.76,
    circuitType: "memory",
  },
  {
    from: FrontendRegion.Caudate_R,
    to: FrontendRegion.Putamen_R,
    weight: 0.82,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.Putamen_R,
    to: FrontendRegion.Pallidum_R,
    weight: 0.8,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.Pallidum_R,
    to: FrontendRegion.Thalamus_R,
    weight: 0.86,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.RostralACC_R,
    to: FrontendRegion.CaudalACC_R,
    weight: 0.78,
    circuitType: "regulatory",
  },
  {
    from: FrontendRegion.CaudalACC_R,
    to: FrontendRegion.MidCingulate_R,
    weight: 0.75,
    circuitType: "regulatory",
  },
  {
    from: FrontendRegion.MidCingulate_R,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.72,
    circuitType: "regulatory",
  },
  {
    from: FrontendRegion.AnteriorInsula_R,
    to: FrontendRegion.PosteriorInsula_R,
    weight: 0.8,
    circuitType: "regulatory",
  },
  {
    from: FrontendRegion.AnteriorInsula_R,
    to: FrontendRegion.Amygdala_R,
    weight: 0.78,
    circuitType: "limbic",
  },
  {
    from: FrontendRegion.PrimaryVisual_R,
    to: FrontendRegion.SecondaryVisual_R,
    weight: 0.88,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.SecondaryVisual_R,
    to: FrontendRegion.V4Area_R,
    weight: 0.8,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.V4Area_R,
    to: FrontendRegion.FusiformGyrus_R,
    weight: 0.76,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.MTArea_R,
    to: FrontendRegion.SuperiorParietal_R,
    weight: 0.74,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.TemporalPole_R,
    to: FrontendRegion.Amygdala_R,
    weight: 0.72,
    circuitType: "limbic",
  },
  {
    from: FrontendRegion.TemporalPole_R,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.74,
    circuitType: "memory",
  },

  // ── CORPUS CALLOSUM (inter-hemispheric, gold arcs) ───────────────────────
  {
    from: FrontendRegion.MedialPFC_L,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.9,
    circuitType: "callosal",
    isCallosal: true,
  },
  {
    from: FrontendRegion.MiddleFrontal_L,
    to: FrontendRegion.MiddleFrontal_R,
    weight: 0.84,
    circuitType: "callosal",
    isCallosal: true,
  },
  {
    from: FrontendRegion.SuperiorFrontal_L,
    to: FrontendRegion.SuperiorFrontal_R,
    weight: 0.82,
    circuitType: "callosal",
    isCallosal: true,
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_L,
    to: FrontendRegion.PrimaryMotorCortex_R,
    weight: 0.9,
    circuitType: "callosal",
    isCallosal: true,
  },
  {
    from: FrontendRegion.PrimarySomatosensory_L,
    to: FrontendRegion.PrimarySomatosensory_R,
    weight: 0.88,
    circuitType: "callosal",
    isCallosal: true,
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.Thalamus_R,
    weight: 0.88,
    circuitType: "callosal",
    isCallosal: true,
  },
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.Hippocampus_R,
    weight: 0.82,
    circuitType: "callosal",
    isCallosal: true,
  },
  {
    from: FrontendRegion.Amygdala_L,
    to: FrontendRegion.Amygdala_R,
    weight: 0.78,
    circuitType: "callosal",
    isCallosal: true,
  },
  {
    from: FrontendRegion.PosteriorCingulate_L,
    to: FrontendRegion.PosteriorCingulate_R,
    weight: 0.86,
    circuitType: "callosal",
    isCallosal: true,
  },
  {
    from: FrontendRegion.PrecuneusRegion_L,
    to: FrontendRegion.PrecuneusRegion_R,
    weight: 0.84,
    circuitType: "callosal",
    isCallosal: true,
  },
  {
    from: FrontendRegion.InferiorParietal_L,
    to: FrontendRegion.InferiorParietal_R,
    weight: 0.8,
    circuitType: "callosal",
    isCallosal: true,
  },
  {
    from: FrontendRegion.SuperiorTemporalGyrus_L,
    to: FrontendRegion.SuperiorTemporalGyrus_R,
    weight: 0.78,
    circuitType: "callosal",
    isCallosal: true,
  },
  {
    from: FrontendRegion.PrimaryVisual_L,
    to: FrontendRegion.PrimaryVisual_R,
    weight: 0.86,
    circuitType: "callosal",
    isCallosal: true,
  },
  {
    from: FrontendRegion.AnteriorInsula_L,
    to: FrontendRegion.AnteriorInsula_R,
    weight: 0.74,
    circuitType: "callosal",
    isCallosal: true,
  },
  {
    from: FrontendRegion.Caudate_L,
    to: FrontendRegion.Caudate_R,
    weight: 0.76,
    circuitType: "callosal",
    isCallosal: true,
  },
  {
    from: FrontendRegion.RostralACC_L,
    to: FrontendRegion.RostralACC_R,
    weight: 0.8,
    circuitType: "callosal",
    isCallosal: true,
  },

  // ── DENSE FRONTAL LOBE INTERNAL WIRING (L+R) ────────────────────────────────
  {
    from: FrontendRegion.ParsOrbitalis_L,
    to: FrontendRegion.VentralMPFC_L,
    weight: 0.82,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.DorsalMPFC_L,
    to: FrontendRegion.MiddleFrontal_L,
    weight: 0.78,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.VentralMPFC_L,
    to: FrontendRegion.RostralACC_L,
    weight: 0.84,
    circuitType: "regulatory",
  },
  {
    from: FrontendRegion.FrontalPole_L,
    to: FrontendRegion.DorsalMPFC_L,
    weight: 0.76,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.BrocaArea_L,
    to: FrontendRegion.ParsOrbitalis_L,
    weight: 0.72,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.ParsOrbitalis_R,
    to: FrontendRegion.VentralMPFC_R,
    weight: 0.82,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.DorsalMPFC_R,
    to: FrontendRegion.MiddleFrontal_R,
    weight: 0.78,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.VentralMPFC_R,
    to: FrontendRegion.RostralACC_R,
    weight: 0.84,
    circuitType: "regulatory",
  },
  // ── TEMPORAL LOBE DENSE WIRING (L+R) ─────────────────────────────────────────
  {
    from: FrontendRegion.SuperiorTemporalGyrus_L,
    to: FrontendRegion.MiddleTemporalGyrus_L,
    weight: 0.8,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.MiddleTemporalGyrus_L,
    to: FrontendRegion.InferiorTemporalGyrus_L,
    weight: 0.76,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.WernickeArea_L,
    to: FrontendRegion.MiddleTemporalGyrus_L,
    weight: 0.85,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.SuperiorTemporalGyrus_R,
    to: FrontendRegion.MiddleTemporalGyrus_R,
    weight: 0.8,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.MiddleTemporalGyrus_R,
    to: FrontendRegion.InferiorTemporalGyrus_R,
    weight: 0.76,
    circuitType: "sensory",
  },
  // ── PARIETAL INTEGRATION (L+R) ───────────────────────────────────────────────
  {
    from: FrontendRegion.SuperiorParietal_L,
    to: FrontendRegion.InferiorParietal_L,
    weight: 0.82,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.InferiorParietal_L,
    to: FrontendRegion.PrecuneusRegion_L,
    weight: 0.78,
    circuitType: "cognitive",
  },
  {
    from: FrontendRegion.SuperiorParietal_R,
    to: FrontendRegion.InferiorParietal_R,
    weight: 0.82,
    circuitType: "sensory",
  },
  {
    from: FrontendRegion.InferiorParietal_R,
    to: FrontendRegion.PrecuneusRegion_R,
    weight: 0.78,
    circuitType: "cognitive",
  },
  // ── LIMBIC CIRCUIT (L+R) ─────────────────────────────────────────────────────
  {
    from: FrontendRegion.Hippocampus_L,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.88,
    circuitType: "memory",
  },
  {
    from: FrontendRegion.EntorhinalCortex,
    to: FrontendRegion.Amygdala_L,
    weight: 0.82,
    circuitType: "limbic",
  },
  {
    from: FrontendRegion.Amygdala_L,
    to: FrontendRegion.Hypothalamus,
    weight: 0.8,
    circuitType: "limbic",
  },
  {
    from: FrontendRegion.Hippocampus_R,
    to: FrontendRegion.EntorhinalCortex,
    weight: 0.86,
    circuitType: "memory",
  },
  {
    from: FrontendRegion.Amygdala_R,
    to: FrontendRegion.Hypothalamus,
    weight: 0.78,
    circuitType: "limbic",
  },
  // ── ASCENDING AROUSAL PATHWAY (brainstem → thalamus → cortex) ───────────
  {
    from: Region.Brainstem,
    to: FrontendRegion.RapheNuclei,
    weight: 0.8,
    circuitType: "ascending",
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: FrontendRegion.Thalamus_L,
    weight: 0.78,
    circuitType: "ascending",
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.82,
    circuitType: "ascending",
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.8,
    circuitType: "ascending",
  },
  {
    from: FrontendRegion.RapheNuclei,
    to: Region.Hippocampus,
    weight: 0.76,
    circuitType: "ascending",
  },
  {
    from: FrontendRegion.Thalamus_L,
    to: FrontendRegion.MedialPFC_L,
    weight: 0.88,
    circuitType: "ascending",
  },
  {
    from: FrontendRegion.Thalamus_R,
    to: FrontendRegion.MedialPFC_R,
    weight: 0.88,
    circuitType: "ascending",
  },

  // ── DESCENDING / CORTICOSPINAL PATHWAYS ───────────────────────────────────
  {
    from: FrontendRegion.PrimaryMotorCortex_L,
    to: Region.Brainstem,
    weight: 0.84,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.PrimaryMotorCortex_R,
    to: Region.Brainstem,
    weight: 0.84,
    circuitType: "motor",
  },
  {
    from: Region.Brainstem,
    to: FrontendRegion.SpinoCerebellarTract,
    weight: 0.78,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.SpinoCerebellarTract,
    to: Region.Cerebellum,
    weight: 0.82,
    circuitType: "motor",
  },
  {
    from: Region.Cerebellum,
    to: FrontendRegion.Thalamus_L,
    weight: 0.84,
    circuitType: "motor",
  },
  {
    from: Region.Cerebellum,
    to: FrontendRegion.Thalamus_R,
    weight: 0.82,
    circuitType: "motor",
  },

  // ── CORE/LEGACY CONNECTIONS ────────────────────────────────────────────────
  {
    from: Region.PrefrontalCortex,
    to: Region.Thalamus,
    weight: 0.78,
    circuitType: "cognitive",
  },
  {
    from: Region.PrefrontalCortex,
    to: Region.Amygdala,
    weight: 0.72,
    circuitType: "limbic",
  },
  {
    from: Region.MotorCortex,
    to: Region.BasalGanglia,
    weight: 0.8,
    circuitType: "motor",
  },
  {
    from: Region.MotorCortex,
    to: Region.Cerebellum,
    weight: 0.76,
    circuitType: "motor",
  },
  {
    from: Region.Thalamus,
    to: Region.SensoryCortex,
    weight: 0.82,
    circuitType: "sensory",
  },
  {
    from: Region.Thalamus,
    to: Region.Hippocampus,
    weight: 0.74,
    circuitType: "memory",
  },
  {
    from: Region.Hippocampus,
    to: Region.Amygdala,
    weight: 0.78,
    circuitType: "limbic",
  },
  {
    from: Region.BasalGanglia,
    to: Region.Thalamus,
    weight: 0.82,
    circuitType: "motor",
  },
  {
    from: Region.Brainstem,
    to: Region.Thalamus,
    weight: 0.84,
    circuitType: "ascending",
  },
  {
    from: Region.Amygdala,
    to: Region.PrefrontalCortex,
    weight: 0.7,
    circuitType: "limbic",
  },
  {
    from: FrontendRegion.Insula,
    to: Region.Amygdala,
    weight: 0.76,
    circuitType: "limbic",
  },
  {
    from: FrontendRegion.AnteriorCingulateCortex,
    to: Region.PrefrontalCortex,
    weight: 0.8,
    circuitType: "regulatory",
  },
  {
    from: FrontendRegion.VentralTegmentalArea,
    to: Region.BasalGanglia,
    weight: 0.84,
    circuitType: "ascending",
  },
  {
    from: Region.Cerebellum,
    to: Region.Brainstem,
    weight: 0.8,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.LocusCoeruleus,
    to: Region.PrefrontalCortex,
    weight: 0.78,
    circuitType: "ascending",
  },
  {
    from: FrontendRegion.SubstantiaNigra,
    to: Region.BasalGanglia,
    weight: 0.82,
    circuitType: "motor",
  },
  {
    from: FrontendRegion.Hypothalamus,
    to: Region.Brainstem,
    weight: 0.74,
    circuitType: "regulatory",
  },
  {
    from: FrontendRegion.AnteriorCingulateCortex,
    to: Region.Amygdala,
    weight: 0.72,
    circuitType: "limbic",
  },
];

// ─── All regions for cloud rendering ─────────────────────────────────────────
const ALL_REGIONS: ExtendedRegion[] = [
  ...Object.values(Region),
  ...Object.values(FrontendRegion),
];

interface BrainSceneProps {
  regionActivities: RegionActivity[];
}

function BrainScene({ regionActivities }: BrainSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  const maps = useMemo(() => {
    const map = new Map<ExtendedRegion, number>();
    const satMap = new Map<ExtendedRegion, boolean>();
    for (const { region, activity, saturationFlag } of regionActivities) {
      map.set(region, activity);
      satMap.set(region, saturationFlag ?? activity >= SATURATION_THRESHOLD);
    }
    return { activityMap: map, satMap };
  }, [regionActivities]);
  const { activityMap, satMap } = maps;

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Synaptic density substrate */}
      <SynapticDensityField />

      {/* Hemisphere ambient glows */}
      <HemisphereGlow />

      {/* Interhemispheric fissure */}
      <MidlinePlane />

      {/* Brain fog */}
      <mesh>
        <sphereGeometry args={[8.0, 16, 16]} />
        <meshStandardMaterial
          color={new THREE.Color(0.04, 0.07, 0.18)}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Micro neuron clouds */}
      {ALL_REGIONS.map((region) => (
        <MicroNeuronCloud
          key={`cloud-${region}`}
          region={region}
          activity={activityMap.get(region) ?? 0}
        />
      ))}

      {/* Region spheres */}
      {ALL_REGIONS.map((region) => (
        <RegionSphere
          key={region}
          region={region}
          activity={activityMap.get(region) ?? 0}
          saturationFlag={satMap.get(region)}
        />
      ))}

      {/* Weighted connection arcs */}
      {WEIGHTED_CONNECTIONS.map(
        ({ from, to, weight, circuitType, isCallosal }) => {
          const fromCfg = REGION_CONFIGS[from];
          const toCfg = REGION_CONFIGS[to];
          if (!fromCfg || !toCfg) return null;
          const fromActivity = activityMap.get(from) ?? 0;
          const toActivity = activityMap.get(to) ?? 0;
          const avgActivity = (fromActivity + toActivity) / 2;
          return (
            <WeightedConnectionArc
              key={`${from}-${to}`}
              from={normalizePos(fromCfg.pos)}
              to={normalizePos(toCfg.pos)}
              activity={avgActivity}
              weight={weight}
              circuitType={circuitType}
              isCallosal={isCallosal ?? false}
            />
          );
        },
      )}
    </group>
  );
}

// ── RegionLegendPanel ────────────────────────────────────────────────────────
interface RegionLegendPanelProps {
  regionActivities: RegionActivity[];
  open: boolean;
  onToggle: () => void;
}

function RegionLegendPanel({
  regionActivities,
  open,
  onToggle,
}: RegionLegendPanelProps) {
  const activityMap = new Map(
    regionActivities.map((r) => [r.region, r.activity]),
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: "8px",
        right: open ? "8px" : "8px",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "4px",
      }}
    >
      {/* Toggle button */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          fontFamily: "monospace",
          fontSize: "8px",
          letterSpacing: "0.12em",
          color: "rgba(218,165,32,0.9)",
          background: "rgba(5,5,18,0.92)",
          border: "1px solid rgba(218,165,32,0.35)",
          padding: "3px 8px",
          cursor: "pointer",
          textTransform: "uppercase",
          pointerEvents: "all",
        }}
      >
        {open ? "▾ REGIONS" : "▸ REGIONS"}
      </button>

      {/* Panel body */}
      {open && (
        <div
          style={{
            background: "rgba(5,5,18,0.92)",
            border: "1px solid rgba(218,165,32,0.28)",
            padding: "6px 8px",
            maxHeight: "280px",
            overflowY: "auto",
            minWidth: "160px",
            pointerEvents: "all",
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "6px",
              letterSpacing: "0.18em",
              color: "rgba(218,165,32,0.6)",
              marginBottom: "5px",
              textTransform: "uppercase",
            }}
          >
            SOVEREIGN REGIONS · 16
          </div>
          {SOVEREIGN_REGIONS.map((region) => {
            const bioName = BIOLOGICAL_NAMES[region] ?? String(region);
            const alias = SOVEREIGN_ALIAS_MAP[region] ?? "";
            const act = activityMap.get(region) ?? 0;
            const pct = Math.round(act * 100);
            const isSaturated = act >= SATURATION_THRESHOLD;
            const barColor = isSaturated
              ? "rgba(251,146,60,0.9)"
              : act > 0.6
                ? "rgba(218,165,32,0.85)"
                : "rgba(100,130,220,0.7)";

            return (
              <div
                key={String(region)}
                style={{
                  marginBottom: "6px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  paddingBottom: "4px",
                }}
              >
                {/* Biological name + pct */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "11px",
                      color: isSaturated
                        ? "rgba(251,146,60,1)"
                        : "rgba(220,225,255,0.92)",
                      lineHeight: 1.2,
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {bioName}
                  </span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "9px",
                      color: isSaturated
                        ? "rgba(251,146,60,0.9)"
                        : "rgba(160,180,240,0.7)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {pct}%
                  </span>
                </div>

                {/* Sovereign alias */}
                {alias && (
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "9px",
                      color: "rgba(218,165,32,0.7)",
                      marginTop: "1px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {alias}
                  </div>
                )}

                {/* Activation bar */}
                <div
                  style={{
                    marginTop: "3px",
                    height: "3px",
                    background: "rgba(20,24,60,0.9)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: barColor,
                      borderRadius: "2px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function BrainVisualization({
  regionActivities,
  stdpWeights,
}: BrainVisualizationProps) {
  const [legendOpen, setLegendOpen] = useState(false);
  const topStdp = stdpWeights
    ? [...stdpWeights]
        .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
        .slice(0, 5)
    : [];
  const maxWeight =
    topStdp.length > 0
      ? Math.max(...topStdp.map((e) => Math.abs(e.weight)), 0.001)
      : 1;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 28], fov: 58 }}
        style={{ background: "transparent" }}
      >
        <ambientLight
          intensity={0.12}
          color={new THREE.Color(0.1, 0.14, 0.28)}
        />
        <pointLight
          position={[4, 4, 4]}
          intensity={0.9}
          color={new THREE.Color(0.3, 0.6, 1.0)}
        />
        <pointLight
          position={[-4, -3, -3]}
          intensity={0.5}
          color={new THREE.Color(0.9, 0.5, 0.1)}
        />
        <pointLight
          position={[0, 6, 0]}
          intensity={0.3}
          color={new THREE.Color(0.5, 0.8, 1.0)}
        />
        <BrainScene regionActivities={regionActivities} />
        <OrbitControls
          enableZoom={true}
          minDistance={10}
          maxDistance={80}
          zoomSpeed={0.8}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={(Math.PI * 4) / 5}
        />
      </Canvas>

      {/* Hemisphere labels */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "8px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "60px",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "8px",
            letterSpacing: "0.15em",
            color: "rgba(80,140,255,0.70)",
            textTransform: "uppercase",
            textShadow: "0 0 8px rgba(60,100,255,0.5)",
          }}
        >
          ◀ LEFT HEMISPHERE
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "8px",
            letterSpacing: "0.15em",
            color: "rgba(255,130,60,0.70)",
            textTransform: "uppercase",
            textShadow: "0 0 8px rgba(255,100,40,0.5)",
          }}
        >
          RIGHT HEMISPHERE ▶
        </span>
      </div>

      {/* Connection type legend */}
      <div
        className="absolute bottom-2 left-2 pointer-events-none flex flex-col gap-[3px]"
        style={{
          background: "rgba(5,5,18,0.88)",
          border: "1px solid rgba(60,80,180,0.3)",
          padding: "5px 8px",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "6px",
            letterSpacing: "0.15em",
            color: "rgba(120,140,200,0.7)",
            marginBottom: "2px",
          }}
        >
          CIRCUIT TYPES
        </div>
        {CIRCUIT_LEGEND.map(({ type, label }) => (
          <div
            key={type}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <div
              style={{
                width: "14px",
                height: "3px",
                borderRadius: "2px",
                background: CIRCUIT_COLORS[type],
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "6px",
                color: "rgba(160,175,210,0.75)",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Region Legend Panel — sovereign dual-name overlay */}
      <RegionLegendPanel
        regionActivities={regionActivities}
        open={legendOpen}
        onToggle={() => setLegendOpen((v) => !v)}
      />

      {/* STDP plasticity bars overlay */}
      {topStdp.length > 0 && !legendOpen && (
        <div
          className="absolute bottom-2 right-2 pointer-events-none flex flex-col gap-[3px]"
          style={{
            background: "rgba(5,5,18,0.88)",
            border: "1px solid rgba(60,80,180,0.3)",
            padding: "4px 6px",
            minWidth: "90px",
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "6px",
              letterSpacing: "0.15em",
              color: "rgba(80,160,80,0.8)",
              marginBottom: "2px",
            }}
          >
            STDP · TOP CONN
          </div>
          {topStdp.map((entry) => {
            const conn = entry.connection.slice(0, 12);
            const barW = Math.abs(entry.weight) / maxWeight;
            const isPos = entry.delta >= 0;
            return (
              <div key={entry.connection} className="flex items-center gap-1">
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "6px",
                    color: "rgba(100,120,180,0.8)",
                    width: "44px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {conn}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "3px",
                    background: "rgba(20,24,60,0.9)",
                    minWidth: "28px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: `${barW * 100}%`,
                      background: isPos ? "#22c55e" : "#ef4444",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
