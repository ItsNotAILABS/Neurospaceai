import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { AvatarBehavior } from "../hooks/useNeuralSimulation";
import type { ExtendedRegion } from "../hooks/useQueries";
import { FrontendRegion, Region } from "../hooks/useQueries";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorldCubeProps {
  avatarBehavior: AvatarBehavior;
  isRunning: boolean;
  onProximityStimulus: (region: ExtendedRegion, intensity: number) => void;
  /** Real per-region activations from the neural sim */
  regionActivations: number[];
  /** Latest thought from the avatar's thought log */
  latestThought?: string;
  /** Full latest thought entry with metadata */
  latestThoughtEntry?: {
    tick: number;
    thought: string;
    dominantRegion: string;
    intensity: number;
  } | null;
}

interface Spark {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

interface Flash {
  position: THREE.Vector3;
  life: number;
  maxLife: number;
}

// ─── World constants ──────────────────────────────────────────────────────────

const WORLD_SIZE = 50; // 3x of original ~17 → 50x50x50
const HALF_WORLD = WORLD_SIZE / 2;

// ─── Environmental Object Definitions ─────────────────────────────────────────

interface EnvObject {
  id: string;
  label: string;
  position: [number, number, number];
  detectionRadius: number;
  region: ExtendedRegion;
  intensity: number;
  color: THREE.Color;
  glowColor: THREE.Color;
  shape: "sphere" | "octahedron" | "torus" | "box" | "tetrahedron";
}

const ENV_OBJECTS: EnvObject[] = [
  // Original objects (repositioned for larger world)
  {
    id: "light_node",
    label: "LIGHT NODE",
    position: [15, -HALF_WORLD + 6, 8],
    detectionRadius: 5,
    region: Region.SensoryCortex,
    intensity: 0.3,
    color: new THREE.Color(0.05, 0.9, 1.0),
    glowColor: new THREE.Color(0.1, 0.85, 1.0),
    shape: "sphere",
  },
  {
    id: "reward_node",
    label: "REWARD NODE",
    position: [-16, -HALF_WORLD + 6, -12],
    detectionRadius: 5,
    region: FrontendRegion.NucleusAccumbens,
    intensity: 0.3,
    color: new THREE.Color(1.0, 0.82, 0.05),
    glowColor: new THREE.Color(1.0, 0.75, 0.0),
    shape: "sphere",
  },
  {
    id: "threat",
    label: "THREAT",
    position: [0, -HALF_WORLD + 6, 20],
    detectionRadius: 6,
    region: Region.Amygdala,
    intensity: 0.4,
    color: new THREE.Color(1.0, 0.1, 0.1),
    glowColor: new THREE.Color(0.9, 0.05, 0.05),
    shape: "octahedron",
  },
  {
    id: "memory_marker",
    label: "MEMORY",
    position: [-14, -HALF_WORLD + 6, 14],
    detectionRadius: 5,
    region: Region.Hippocampus,
    intensity: 0.25,
    color: new THREE.Color(0.05, 1.0, 0.9),
    glowColor: new THREE.Color(0.0, 0.85, 0.8),
    shape: "torus",
  },
  {
    id: "temp_zone",
    label: "TEMP ZONE",
    position: [18, -HALF_WORLD + 6, -16],
    detectionRadius: 6,
    region: FrontendRegion.Hypothalamus,
    intensity: 0.2,
    color: new THREE.Color(1.0, 0.45, 0.05),
    glowColor: new THREE.Color(0.9, 0.4, 0.05),
    shape: "sphere",
  },
  // ── New objects in expanded world ─────────────────────────────────────────
  {
    id: "food_node_1",
    label: "FOOD α",
    position: [10, -HALF_WORLD + 6, -20],
    detectionRadius: 5,
    region: FrontendRegion.NucleusAccumbens,
    intensity: 0.25,
    color: new THREE.Color(0.2, 0.9, 0.2),
    glowColor: new THREE.Color(0.1, 0.8, 0.1),
    shape: "sphere",
  },
  {
    id: "food_node_2",
    label: "FOOD β",
    position: [-20, -HALF_WORLD + 6, 8],
    detectionRadius: 5,
    region: FrontendRegion.Hypothalamus,
    intensity: 0.25,
    color: new THREE.Color(0.2, 0.85, 0.3),
    glowColor: new THREE.Color(0.1, 0.75, 0.2),
    shape: "sphere",
  },
  {
    id: "food_node_3",
    label: "FOOD γ",
    position: [0, -HALF_WORLD + 6, -15],
    detectionRadius: 5,
    region: FrontendRegion.NucleusAccumbens,
    intensity: 0.25,
    color: new THREE.Color(0.15, 0.95, 0.4),
    glowColor: new THREE.Color(0.1, 0.85, 0.3),
    shape: "sphere",
  },
  {
    id: "novel_object",
    label: "NOVEL",
    position: [20, -HALF_WORLD + 6, 5],
    detectionRadius: 5,
    region: FrontendRegion.VentralTegmentalArea,
    intensity: 0.3,
    color: new THREE.Color(0.0, 0.9, 1.0),
    glowColor: new THREE.Color(0.0, 0.8, 1.0),
    shape: "tetrahedron",
  },
  {
    id: "social_mirror",
    label: "MIRROR",
    position: [-8, -HALF_WORLD + 6, -20],
    detectionRadius: 5,
    region: FrontendRegion.SuperiorTemporalSulcus,
    intensity: 0.25,
    color: new THREE.Color(0.9, 0.9, 0.95),
    glowColor: new THREE.Color(0.85, 0.85, 0.9),
    shape: "sphere",
  },
];

// Obstacle clusters in the larger world
const OBSTACLE_POSITIONS: Array<{
  pos: [number, number, number];
  id: string;
  size: [number, number, number];
}> = [
  { pos: [8, -HALF_WORLD + 3, -6], id: "obs-a", size: [2, 1.5, 2] },
  { pos: [-8, -HALF_WORLD + 3, 4], id: "obs-b", size: [1.5, 1, 1.5] },
  { pos: [3, -HALF_WORLD + 3, -14], id: "obs-c", size: [2, 1.2, 2] },
  { pos: [-18, -HALF_WORLD + 3, -5], id: "obs-d", size: [1.5, 1, 2] },
  { pos: [12, -HALF_WORLD + 3, 15], id: "obs-e", size: [2, 1.5, 1.5] },
];

// ─── Particles ────────────────────────────────────────────────────────────────

function NeuralParticles({ globalArousal }: { globalArousal: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const sparksRef = useRef<Spark[]>([]);
  const maxSparks = 12000;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(maxSparks * 3);
    const colors = new Float32Array(maxSparks * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useFrame((_, delta) => {
    const spawnCount = Math.floor(globalArousal * 25);
    for (let i = 0; i < spawnCount; i++) {
      if (sparksRef.current.length < maxSparks) {
        sparksRef.current.push({
          position: new THREE.Vector3(
            (Math.random() - 0.5) * WORLD_SIZE,
            (Math.random() - 0.5) * WORLD_SIZE,
            (Math.random() - 0.5) * WORLD_SIZE,
          ),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 0.6 + 0.12,
            (Math.random() - 0.5) * 0.6,
          ),
          life: 0,
          maxLife: 1.5 + Math.random() * 2,
        });
      }
    }

    sparksRef.current = sparksRef.current.filter((s) => s.life < s.maxLife);
    for (const spark of sparksRef.current) {
      spark.life += delta;
      spark.position.addScaledVector(spark.velocity, delta);
      if (Math.abs(spark.position.x) > HALF_WORLD) spark.velocity.x *= -1;
      if (Math.abs(spark.position.y) > HALF_WORLD) spark.velocity.y *= -1;
      if (Math.abs(spark.position.z) > HALF_WORLD) spark.velocity.z *= -1;
    }

    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;
    const count = sparksRef.current.length;

    for (let i = 0; i < count; i++) {
      const spark = sparksRef.current[i];
      const age = spark.life / spark.maxLife;
      positions[i * 3] = spark.position.x;
      positions[i * 3 + 1] = spark.position.y;
      positions[i * 3 + 2] = spark.position.z;

      if (age < 0.5) {
        colors[i * 3] = 0.1 + age * 0.5;
        colors[i * 3 + 1] = 0.8 - age * 0.2;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.7 - (age - 0.5) * 1.0;
        colors[i * 3 + 2] = 0.2 - (age - 0.5) * 0.4;
      }
    }

    for (let i = count; i < maxSparks; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -200;
      positions[i * 3 + 2] = 0;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.setDrawRange(0, count);
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

function SynapticFlashLayer({ globalArousal }: { globalArousal: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const flashesRef = useRef<Flash[]>([]);
  const maxFlashes = 6000;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(maxFlashes * 3);
    const colors = new Float32Array(maxFlashes * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useFrame((_, delta) => {
    const spawnCount = Math.floor(globalArousal * 35);
    for (let i = 0; i < spawnCount; i++) {
      if (flashesRef.current.length < maxFlashes) {
        flashesRef.current.push({
          position: new THREE.Vector3(
            (Math.random() - 0.5) * WORLD_SIZE,
            (Math.random() - 0.5) * WORLD_SIZE,
            (Math.random() - 0.5) * WORLD_SIZE,
          ),
          life: 0,
          maxLife: 0.15 + Math.random() * 0.25,
        });
      }
    }

    flashesRef.current = flashesRef.current.filter((f) => f.life < f.maxLife);
    for (const flash of flashesRef.current) {
      flash.life += delta;
    }

    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;
    const count = flashesRef.current.length;

    for (let i = 0; i < count; i++) {
      const flash = flashesRef.current[i];
      const age = flash.life / flash.maxLife;
      const fade = 1 - age;

      positions[i * 3] = flash.position.x;
      positions[i * 3 + 1] = flash.position.y;
      positions[i * 3 + 2] = flash.position.z;

      if (age < 0.3) {
        const t = age / 0.3;
        colors[i * 3] = 1.0 - t * 0.9;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
        material.opacity = fade;
      } else {
        colors[i * 3] = 0.1 * fade;
        colors[i * 3 + 1] = 0.9 * fade;
        colors[i * 3 + 2] = 1.0 * fade;
      }
    }

    for (let i = count; i < maxFlashes; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -200;
      positions[i * 3 + 2] = 0;
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0;
      colors[i * 3 + 2] = 0;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.setDrawRange(0, count);
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

// ─── NT → color ───────────────────────────────────────────────────────────────

function ntToBodyColor(dominantNT: AvatarBehavior["dominantNT"]): THREE.Color {
  switch (dominantNT) {
    case "dopamine":
      return new THREE.Color().setHSL(45 / 360, 0.8, 0.55);
    case "serotonin":
      return new THREE.Color().setHSL(140 / 360, 0.7, 0.45);
    case "norepinephrine":
      return new THREE.Color().setHSL(10 / 360, 0.85, 0.5);
    case "gaba":
      return new THREE.Color().setHSL(230 / 360, 0.6, 0.5);
    case "glutamate":
      return new THREE.Color().setHSL(60 / 360, 0.9, 0.55);
    case "acetylcholine":
      return new THREE.Color().setHSL(180 / 360, 0.75, 0.5);
    default:
      return new THREE.Color().setHSL(195 / 360, 0.7, 0.45);
  }
}

// ─── Avatar Component ─────────────────────────────────────────────────────────

interface AvatarProps {
  behavior: AvatarBehavior;
  regionActivations: number[];
  worldPosition: { x: number; y: number; z: number };
  latestThought?: string;
}

function Avatar({
  behavior,
  regionActivations,
  worldPosition,
  latestThought: _latestThought,
}: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const torsoRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const smoothedPos = useRef(new THREE.Vector3(0, -HALF_WORLD + 6, 0));
  const facingAngle = useRef(0);

  const bodyColor = useMemo(
    () => ntToBodyColor(behavior.dominantNT),
    [behavior.dominantNT],
  );

  // Neural-state driven color: interpolate calm blue -> threat orange based on
  // (amygActivation - pfcActivation). regionActivations[4] ≈ Amygdala, [1] ≈ PFC
  const neuralStateColor = useMemo(() => {
    // Use consciousness (arousal) and emotionValence as proxy for amyg/PFC balance
    const threatBias = Math.max(
      0,
      Math.min(
        1,
        ((-behavior.emotionValence + 1) / 2) * behavior.consciousnessLevel,
      ),
    );
    // Calm: hsl(220, 60%, 35%) → Threat: hsl(15, 90%, 55%)
    const h = (220 - threatBias * 205) / 360;
    const s = 0.6 + threatBias * 0.3;
    const l = 0.35 + threatBias * 0.2;
    return new THREE.Color().setHSL(h, s, l);
  }, [behavior.emotionValence, behavior.consciousnessLevel]);

  const emissiveIntensity = 2.0 + behavior.consciousnessLevel * 3.0;

  // Pulse speed scales with globalFiringRate proxy (consciousnessLevel)
  const _pulseFreq = 1.0 + behavior.consciousnessLevel * 3.0; // used in pulse calculation

  useFrame((_, delta) => {
    if (!groupRef.current || !headRef.current) return;
    timeRef.current += delta;
    const t = timeRef.current;

    const targetX = worldPosition.x;
    const targetZ = worldPosition.z;
    const targetY = -HALF_WORLD + 6;
    smoothedPos.current.x += (targetX - smoothedPos.current.x) * 0.05;
    smoothedPos.current.y += (targetY - smoothedPos.current.y) * 0.05;
    smoothedPos.current.z += (targetZ - smoothedPos.current.z) * 0.05;

    groupRef.current.position.set(
      smoothedPos.current.x,
      smoothedPos.current.y,
      smoothedPos.current.z,
    );

    const dx = behavior.avatarVelocity.x;
    const dz = behavior.avatarVelocity.z;
    if (Math.abs(dx) + Math.abs(dz) > 0.001) {
      const targetAngle = Math.atan2(dx, dz);
      const da = targetAngle - facingAngle.current;
      const normDa = ((da + Math.PI) % (2 * Math.PI)) - Math.PI;
      facingAngle.current += normDa * 0.08;
      groupRef.current.rotation.y = facingAngle.current;
    }

    if (torsoRef.current) {
      const breathFreq = 0.5 + behavior.breathingRate * 1.5;
      const breathScale = 1.0 + Math.sin(t * breathFreq * Math.PI * 2) * 0.02;
      torsoRef.current.scale.y = breathScale;
      // Neural pulse: head scales subtly with firing rate frequency
      if (headRef.current) {
        const pulseF = 1.0 + behavior.consciousnessLevel * 3.0;
        const ps =
          1.0 + Math.sin(t * pulseF * 2) * 0.03 * behavior.consciousnessLevel;
        headRef.current.scale.setScalar(ps);
      }
    }

    if (behavior.motionLevel > 0.3) {
      const stepSpeed = 3 + behavior.motionLevel * 4;
      const stepAmp = 0.08 * behavior.motionLevel;
      if (leftLegRef.current) {
        leftLegRef.current.position.y =
          -0.35 + Math.sin(t * stepSpeed) * stepAmp;
      }
      if (rightLegRef.current) {
        rightLegRef.current.position.y =
          -0.35 + Math.sin(t * stepSpeed + Math.PI) * stepAmp;
      }
    }

    switch (behavior.postureState) {
      case "sleeping":
        groupRef.current.scale.y = 1.0;
        groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.15;
        headRef.current.rotation.x = 0.4;
        break;
      case "fearful":
        groupRef.current.scale.y = 0.88;
        headRef.current.rotation.y = Math.sin(t * 3) * 0.3;
        groupRef.current.rotation.z = 0;
        if (leftArmRef.current) leftArmRef.current.rotation.z = -0.8;
        if (rightArmRef.current) rightArmRef.current.rotation.z = 0.8;
        break;
      case "motivated":
        groupRef.current.scale.y = 1.08;
        headRef.current.rotation.y = Math.sin(t * 0.8) * 0.15;
        groupRef.current.rotation.z = 0;
        if (leftArmRef.current)
          leftArmRef.current.rotation.z = 0.4 + Math.sin(t * 3) * 0.15;
        if (rightArmRef.current)
          rightArmRef.current.rotation.z =
            -0.4 + Math.sin(t * 3 + Math.PI) * 0.15;
        break;
      case "focused":
        groupRef.current.scale.y = 1.0;
        headRef.current.rotation.y = 0;
        headRef.current.rotation.x = -0.1;
        groupRef.current.rotation.z = 0;
        if (leftArmRef.current) leftArmRef.current.rotation.z = 0.3;
        if (rightArmRef.current) rightArmRef.current.rotation.z = -0.3;
        break;
      case "alert":
        groupRef.current.scale.y = 1.0;
        headRef.current.rotation.y = Math.sin(t * 0.6) * 0.5;
        groupRef.current.rotation.z = 0;
        if (leftArmRef.current)
          leftArmRef.current.rotation.z = 0.4 + behavior.motionLevel * 0.2;
        if (rightArmRef.current)
          rightArmRef.current.rotation.z = -(0.4 + behavior.motionLevel * 0.2);
        break;
      default:
        groupRef.current.scale.y = 1.0;
        headRef.current.rotation.y = Math.sin(t * 0.3) * 0.1;
        headRef.current.rotation.x = 0;
        groupRef.current.rotation.z = 0;
        if (leftArmRef.current) leftArmRef.current.rotation.z = 0.4;
        if (rightArmRef.current) rightArmRef.current.rotation.z = -0.4;
        break;
    }

    if (
      behavior.motionLevel > 0.3 &&
      behavior.postureState !== "fearful" &&
      behavior.postureState !== "focused"
    ) {
      const motorSpeed = 2 + behavior.motionLevel * 3;
      const motorAmp = 0.3 * behavior.motionLevel;
      if (leftArmRef.current)
        leftArmRef.current.rotation.z =
          0.4 + Math.sin(t * motorSpeed) * motorAmp;
      if (rightArmRef.current)
        rightArmRef.current.rotation.z =
          -0.4 + Math.sin(t * motorSpeed + Math.PI) * motorAmp;
    }
  });

  const crownActivations = regionActivations.slice(0, 12);
  const ntColor = ntToBodyColor(behavior.dominantNT);
  const perceptionRadius = 4.0 + behavior.attentionLevel * 7;
  const perceptionOpacity = 0.05 + behavior.attentionLevel * 0.08;

  return (
    <group ref={groupRef} position={[0, -HALF_WORLD + 6, 0]}>
      {/* Perception radius sphere */}
      <mesh>
        <sphereGeometry args={[perceptionRadius, 12, 12]} />
        <meshStandardMaterial
          color={ntColor}
          emissive={ntColor}
          emissiveIntensity={0.4}
          transparent
          opacity={perceptionOpacity}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Torso */}
      <mesh ref={torsoRef} position={[0, 0.65, 0]}>
        <cylinderGeometry args={[1.1, 1.3, 3.8, 10]} />
        <meshStandardMaterial
          color={bodyColor}
          emissive={bodyColor}
          emissiveIntensity={emissiveIntensity * 0.8}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Head — neural-state color coupling */}
      <mesh ref={headRef} position={[0, 3.6, 0]}>
        <sphereGeometry args={[1.15, 16, 16]} />
        <meshStandardMaterial
          color={neuralStateColor}
          emissive={neuralStateColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Head glow halo — pulses at neuralStateColor with firing-rate frequency */}
      <mesh position={[0, 3.6, 0]}>
        <sphereGeometry args={[1.85, 10, 10]} />
        <meshStandardMaterial
          color={neuralStateColor}
          emissive={neuralStateColor}
          emissiveIntensity={emissiveIntensity * 0.6}
          transparent
          opacity={0.12 + behavior.consciousnessLevel * 0.18}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Left arm */}
      <group ref={leftArmRef} position={[-1.25, 1.0, 0]} rotation={[0, 0, 0.4]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.16, 1.5, 8]} />
          <meshStandardMaterial
            color={bodyColor}
            emissive={bodyColor}
            emissiveIntensity={emissiveIntensity * 0.6}
            roughness={0.4}
            metalness={0.4}
          />
        </mesh>
      </group>

      {/* Right arm */}
      <group
        ref={rightArmRef}
        position={[1.25, 1.0, 0]}
        rotation={[0, 0, -0.4]}
      >
        <mesh>
          <cylinderGeometry args={[0.2, 0.16, 1.5, 8]} />
          <meshStandardMaterial
            color={bodyColor}
            emissive={bodyColor}
            emissiveIntensity={emissiveIntensity * 0.6}
            roughness={0.4}
            metalness={0.4}
          />
        </mesh>
      </group>

      {/* Left leg */}
      <group ref={leftLegRef} position={[-0.48, -0.9, 0]}>
        <mesh>
          <cylinderGeometry args={[0.25, 0.2, 1.5, 8]} />
          <meshStandardMaterial
            color={bodyColor}
            emissive={bodyColor}
            emissiveIntensity={emissiveIntensity * 0.6}
            roughness={0.4}
            metalness={0.4}
          />
        </mesh>
      </group>

      {/* Right leg */}
      <group ref={rightLegRef} position={[0.48, -0.9, 0]}>
        <mesh>
          <cylinderGeometry args={[0.25, 0.2, 1.5, 8]} />
          <meshStandardMaterial
            color={bodyColor}
            emissive={bodyColor}
            emissiveIntensity={emissiveIntensity * 0.6}
            roughness={0.4}
            metalness={0.4}
          />
        </mesh>
      </group>

      {/* Thought bubble rendered as HTML overlay outside canvas */}

      {/* Neural crown — always visible */}
      <group position={[0, 4.1, 0]}>
        {(
          [
            "c0",
            "c1",
            "c2",
            "c3",
            "c4",
            "c5",
            "c6",
            "c7",
            "c8",
            "c9",
            "c10",
            "c11",
          ] as const
        ).map((nodeId, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const rawActivation =
            crownActivations[i] ?? behavior.consciousnessLevel;
          const activation = Math.max(0.1, rawActivation);
          const crownColor = new THREE.Color().setHSL(
            (195 + i * 15) / 360,
            0.9,
            0.55 + activation * 0.3,
          );
          return (
            <mesh
              key={nodeId}
              position={[
                Math.cos(angle) * 0.65,
                0.1 + activation * 0.5,
                Math.sin(angle) * 0.65,
              ]}
            >
              <sphereGeometry args={[0.07 + activation * 0.05, 8, 8]} />
              <meshStandardMaterial
                color={crownColor}
                emissive={crownColor}
                emissiveIntensity={2.5 + activation * 4}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// ─── Environmental Object ─────────────────────────────────────────────────────

function EnvironmentalObject({
  obj,
  avatarPos,
}: {
  obj: EnvObject;
  avatarPos: THREE.Vector3;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(Math.random() * 100);
  const glowRef = useRef<THREE.Mesh>(null);

  const dist = avatarPos.distanceTo(new THREE.Vector3(...obj.position));
  const nearbyFactor = Math.max(0, 1 - dist / obj.detectionRadius);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const pulse = 1 + Math.sin(t * 2) * 0.1 * (1 + nearbyFactor * 0.5);
    if (meshRef.current) {
      meshRef.current.scale.setScalar(pulse);
      meshRef.current.rotation.y = t * 0.5;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(
        1.5 + nearbyFactor * 0.8 + Math.sin(t * 2) * 0.1,
      );
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.08 + nearbyFactor * 0.15;
    }
  });

  const emissiveStrength = 1.5 + nearbyFactor * 3;

  const renderShape = () => {
    switch (obj.shape) {
      case "octahedron":
        return <octahedronGeometry args={[0.5, 0]} />;
      case "torus":
        return <torusGeometry args={[0.4, 0.14, 8, 16]} />;
      case "box":
        return <boxGeometry args={[0.6, 0.6, 0.6]} />;
      case "tetrahedron":
        return <tetrahedronGeometry args={[0.5, 0]} />;
      default:
        return <sphereGeometry args={[0.4, 12, 12]} />;
    }
  };

  return (
    <group position={obj.position}>
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial
          color={obj.glowColor}
          emissive={obj.glowColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Main shape */}
      <mesh ref={meshRef}>
        {renderShape()}
        <meshStandardMaterial
          color={obj.color}
          emissive={obj.glowColor}
          emissiveIntensity={emissiveStrength}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Label rendered via HTML overlay outside canvas */}
    </group>
  );
}

// ─── Obstacle ─────────────────────────────────────────────────────────────────

function ObstacleCluster() {
  return (
    <>
      {OBSTACLE_POSITIONS.map(({ pos, id, size }) => (
        <mesh key={id} position={pos}>
          <boxGeometry args={size} />
          <meshStandardMaterial
            color={new THREE.Color(0.25, 0.1, 0.35)}
            emissive={new THREE.Color(0.15, 0.05, 0.25)}
            emissiveIntensity={0.6}
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>
      ))}
    </>
  );
}

// ─── Proximity detection + World Scene ───────────────────────────────────────

// ─── Dynamic Time-of-Day Lighting ─────────────────────────────────────────────
// Shifts hue from cool blue (dawn) to warm amber (midday) to deep violet (dusk)
// based on tick % 3000 without any scripted behavior.

function DynamicSunLight({ tick }: { tick: number }) {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (!lightRef.current) return;
    // Slow ambient cycle ~50s period, tick-seeded
    const phase = ((tick % 3000) / 3000) * Math.PI * 2 + timeRef.current * 0.02;
    const dawn = Math.max(0, Math.cos(phase)); // cool blue when high
    const midday = Math.max(0, Math.cos(phase - Math.PI * 0.5)); // amber
    const dusk = Math.max(0, Math.cos(phase - Math.PI)); // deep violet

    lightRef.current.color.setRGB(
      0.4 + midday * 0.5 + dusk * 0.1,
      0.5 + dawn * 0.2 + midday * 0.3,
      0.6 + dawn * 0.35 - midday * 0.2 + dusk * 0.25,
    );
    lightRef.current.intensity = 1.5 + midday * 1.5 + dawn * 0.5;
  });

  return (
    <directionalLight
      ref={lightRef}
      position={[20, 30, 10]}
      intensity={1.5}
      castShadow={false}
    />
  );
}

// ─── Waypoint Pillars ─────────────────────────────────────────────────────────
// Three tall pillars that pulse based on avatar goal direction.

const WAYPOINT_POSITIONS: Array<{
  pos: [number, number, number];
  id: string;
  goalAffinity: string;
}> = [
  { pos: [0, 0, 20], id: "wp0", goalAffinity: "threat" },
  { pos: [15, 0, -10], id: "wp1", goalAffinity: "reward" },
  { pos: [-15, 0, -5], id: "wp2", goalAffinity: "memory" },
];

function WaypointPillars({
  avatarBehavior,
}: { avatarBehavior: AvatarBehavior }) {
  const refs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const consciousnessLevel = avatarBehavior.consciousnessLevel;
    const emotionValence = avatarBehavior.emotionValence;

    WAYPOINT_POSITIONS.forEach(({ goalAffinity }, i) => {
      const ref = refs[i];
      if (!ref.current) return;
      const mat = ref.current.material as THREE.MeshStandardMaterial;

      // Pulse brightness based on goal affinity / avatar state
      let pulse = 0.3;
      if (goalAffinity === "threat" && emotionValence < -0.2) {
        pulse = 0.6 + Math.sin(t * 3) * 0.3;
      } else if (goalAffinity === "reward" && emotionValence > 0.2) {
        pulse = 0.6 + Math.sin(t * 2.5) * 0.3;
      } else if (goalAffinity === "memory" && consciousnessLevel > 0.5) {
        pulse = 0.5 + Math.sin(t * 2) * 0.2;
      } else {
        pulse = 0.2 + Math.sin(t * 1.2 + i * 1.3) * 0.1;
      }
      mat.emissiveIntensity = pulse;
    });
  });

  return (
    <>
      {WAYPOINT_POSITIONS.map(({ pos, id, goalAffinity }, i) => {
        const colors: Record<string, THREE.Color> = {
          threat: new THREE.Color(1.0, 0.15, 0.15),
          reward: new THREE.Color(1.0, 0.75, 0.1),
          memory: new THREE.Color(0.1, 0.9, 0.8),
        };
        const col = colors[goalAffinity] ?? new THREE.Color(0.5, 0.5, 1.0);
        return (
          <mesh
            key={id}
            ref={refs[i]}
            position={[pos[0], pos[1] - HALF_WORLD + 15, pos[2]]}
          >
            <boxGeometry args={[0.35, 30, 0.35]} />
            <meshStandardMaterial
              color={col}
              emissive={col}
              emissiveIntensity={0.3}
              transparent
              opacity={0.7}
              roughness={0.3}
              metalness={0.6}
            />
          </mesh>
        );
      })}
    </>
  );
}

// ─── Pause/Freeze Halo ────────────────────────────────────────────────────────
// Emits a faint expanding ring when avatar is in freeze/pause motor state.

function FreezeHalo({
  avatarBehavior,
  avatarPos,
}: { avatarBehavior: AvatarBehavior; avatarPos: THREE.Vector3 }) {
  const torusRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(0);
  const opacityRef = useRef(0);

  useFrame((_, delta) => {
    // Detect pause/freeze from low motion + high consciousness (freeze state)
    const isFreeze =
      avatarBehavior.motionLevel < 0.08 &&
      avatarBehavior.consciousnessLevel > 0.45;
    if (isFreeze) {
      scaleRef.current = Math.min(1.5, scaleRef.current + delta * 0.8);
      opacityRef.current = Math.min(0.6, opacityRef.current + delta * 0.5);
    } else {
      scaleRef.current = Math.max(0, scaleRef.current - delta * 1.5);
      opacityRef.current = Math.max(0, opacityRef.current - delta * 1.0);
    }
    if (torusRef.current) {
      torusRef.current.scale.setScalar(scaleRef.current);
      const mat = torusRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = opacityRef.current;
    }
  });

  return (
    <mesh
      ref={torusRef}
      position={[avatarPos.x, -HALF_WORLD + 3, avatarPos.z]}
      rotation={[Math.PI / 2, 0, 0]}
      scale={0}
    >
      <torusGeometry args={[3, 0.12, 8, 32]} />
      <meshStandardMaterial
        color={new THREE.Color(0.3, 0.8, 1.0)}
        emissive={new THREE.Color(0.3, 0.8, 1.0)}
        emissiveIntensity={2.0}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Perception Raycasts (visual only) ────────────────────────────────────────
// Draws faint lines from avatar to 3 nearest world objects, opacity = proximity salience.

function PerceptionRaycasts({
  avatarPos,
  regionActivations: _regionActivations,
}: { avatarPos: THREE.Vector3; regionActivations: number[] }) {
  const linesRef = useRef<THREE.Group>(null);
  const lineGeosRef = useRef<THREE.BufferGeometry[]>([]);
  const lineMatsRef = useRef<THREE.LineBasicMaterial[]>([]);

  // Build line geometries once
  useEffect(() => {
    if (!linesRef.current) return;
    // Clear children
    while (linesRef.current.children.length > 0) {
      linesRef.current.remove(linesRef.current.children[0]);
    }
    lineGeosRef.current = [];
    lineMatsRef.current = [];

    for (let i = 0; i < 3; i++) {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(6); // 2 points × 3 coords
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color(0.3, 0.9, 1.0),
        transparent: true,
        opacity: 0,
        linewidth: 1,
      });
      const line = new THREE.Line(geo, mat);
      linesRef.current.add(line);
      lineGeosRef.current.push(geo);
      lineMatsRef.current.push(mat);
    }
  }, []);

  useFrame(() => {
    if (!linesRef.current) return;
    // Sort env objects by distance to avatar, pick nearest 3
    const sorted = [...ENV_OBJECTS]
      .map((obj) => ({
        obj,
        dist: avatarPos.distanceTo(new THREE.Vector3(...obj.position)),
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3);

    sorted.forEach(({ obj, dist }, i) => {
      const geo = lineGeosRef.current[i];
      const mat = lineMatsRef.current[i];
      if (!geo || !mat) return;

      // Salience = proximity within 25 units
      const salience = Math.max(0, 1 - dist / 25);

      const positions = geo.attributes.position as THREE.BufferAttribute;
      positions.setXYZ(0, avatarPos.x, avatarPos.y, avatarPos.z);
      positions.setXYZ(1, obj.position[0], obj.position[1], obj.position[2]);
      positions.needsUpdate = true;

      mat.opacity = salience * 0.4;
    });
  });

  return <group ref={linesRef} />;
}

interface WorldSceneProps {
  avatarBehavior: AvatarBehavior;
  isRunning: boolean;
  onProximityStimulus: (region: ExtendedRegion, intensity: number) => void;
  regionActivations: number[];
  latestThought?: string;
}

function WorldScene({
  avatarBehavior,
  isRunning,
  onProximityStimulus,
  regionActivations,
  latestThought,
}: WorldSceneProps) {
  const timeRef = useRef(0);
  const scanRef = useRef<THREE.Mesh>(null);
  const scanRef2 = useRef<THREE.Mesh>(null);

  const avatarPosRef = useRef(new THREE.Vector3(0, -HALF_WORLD + 6, 0));
  const injectionCounters = useRef<Record<string, number>>({});

  useEffect(() => {
    for (const obj of ENV_OBJECTS) {
      injectionCounters.current[obj.id] = 60;
    }
    injectionCounters.current.obstacle = 60;
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;

    if (scanRef.current) {
      scanRef.current.position.y =
        -HALF_WORLD + ((timeRef.current * 0.5) % WORLD_SIZE);
    }
    if (scanRef2.current) {
      scanRef2.current.position.y =
        HALF_WORLD - ((timeRef.current * 0.65) % WORLD_SIZE);
    }

    const target = avatarBehavior.avatarWorldPos;
    avatarPosRef.current.x += (target.x - avatarPosRef.current.x) * 0.1;
    avatarPosRef.current.z += (target.z - avatarPosRef.current.z) * 0.1;
    avatarPosRef.current.y = -HALF_WORLD + 6;

    for (const obj of ENV_OBJECTS) {
      injectionCounters.current[obj.id] =
        (injectionCounters.current[obj.id] ?? 60) + 1;
      const objPos = new THREE.Vector3(...obj.position);
      const dist = avatarPosRef.current.distanceTo(objPos);
      if (
        dist < obj.detectionRadius &&
        injectionCounters.current[obj.id] >= 60
      ) {
        onProximityStimulus(obj.region, obj.intensity);
        injectionCounters.current[obj.id] = 0;
      }
    }

    injectionCounters.current.obstacle =
      (injectionCounters.current.obstacle ?? 60) + 1;
    for (const { pos: obsPos } of OBSTACLE_POSITIONS) {
      const oPos = new THREE.Vector3(...obsPos);
      if (
        avatarPosRef.current.distanceTo(oPos) < 4 &&
        injectionCounters.current.obstacle >= 60
      ) {
        onProximityStimulus(Region.BasalGanglia, 0.2);
        injectionCounters.current.obstacle = 0;
        break;
      }
    }
  });

  const edges = useMemo(() => {
    const box = new THREE.BoxGeometry(WORLD_SIZE, WORLD_SIZE, WORLD_SIZE);
    return new THREE.EdgesGeometry(box);
  }, []);

  const innerEdges = useMemo(() => {
    const box = new THREE.BoxGeometry(
      WORLD_SIZE - 4,
      WORLD_SIZE - 4,
      WORLD_SIZE - 4,
    );
    return new THREE.EdgesGeometry(box);
  }, []);

  return (
    <>
      {/* World cube wireframe */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial
          color={new THREE.Color(0.1, 0.4, 0.8)}
          transparent
          opacity={0.2}
          linewidth={1}
        />
      </lineSegments>

      {/* Inner cube */}
      <lineSegments geometry={innerEdges}>
        <lineBasicMaterial
          color={new THREE.Color(0.05, 0.2, 0.5)}
          transparent
          opacity={0.08}
        />
      </lineSegments>

      {/* Grid floor */}
      <gridHelper
        args={[
          WORLD_SIZE - 4,
          30,
          new THREE.Color(0.1, 0.3, 0.7),
          new THREE.Color(0.05, 0.15, 0.4),
        ]}
        position={[0, -HALF_WORLD + 1, 0]}
      />

      {/* Corner pillars */}
      {(
        [
          [-HALF_WORLD + 1, -HALF_WORLD + 1, "nw"],
          [HALF_WORLD - 1, -HALF_WORLD + 1, "ne"],
          [-HALF_WORLD + 1, HALF_WORLD - 1, "sw"],
          [HALF_WORLD - 1, HALF_WORLD - 1, "se"],
        ] as [number, number, string][]
      ).map(([x, z, id]) => (
        <mesh key={id} position={[x, 0, z]}>
          <cylinderGeometry args={[0.08, 0.08, WORLD_SIZE, 6]} />
          <meshStandardMaterial
            color={new THREE.Color(0.1, 0.5, 1.0)}
            emissive={new THREE.Color(0.1, 0.5, 1.0)}
            emissiveIntensity={0.5}
            transparent
            opacity={0.35}
          />
        </mesh>
      ))}

      {/* World label rendered via HTML overlay */}

      {/* Avatar */}
      <Avatar
        behavior={avatarBehavior}
        regionActivations={regionActivations}
        worldPosition={avatarBehavior.avatarWorldPos}
        latestThought={latestThought}
      />

      {/* Dynamic time-of-day lighting (v32+) */}
      <DynamicSunLight tick={Math.floor(timeRef.current * 20)} />

      {/* Waypoint pillars that pulse with goal direction (v32+) */}
      <WaypointPillars avatarBehavior={avatarBehavior} />

      {/* Freeze/pause halo ring (v32+) */}
      <FreezeHalo
        avatarBehavior={avatarBehavior}
        avatarPos={avatarPosRef.current}
      />

      {/* Perception raycast lines (v32+) */}
      <PerceptionRaycasts
        avatarPos={avatarPosRef.current}
        regionActivations={regionActivations}
      />

      {/* Environmental objects */}
      {ENV_OBJECTS.map((obj) => (
        <EnvironmentalObject
          key={obj.id}
          obj={obj}
          avatarPos={avatarPosRef.current}
        />
      ))}

      {/* Obstacles */}
      <ObstacleCluster />

      {/* Neural particles */}
      <NeuralParticles
        globalArousal={isRunning ? avatarBehavior.consciousnessLevel : 0.1}
      />

      {/* Synaptic flash layer */}
      <SynapticFlashLayer
        globalArousal={isRunning ? avatarBehavior.consciousnessLevel : 0.05}
      />

      {/* Scanning planes */}
      <mesh
        ref={scanRef}
        position={[0, -HALF_WORLD, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[WORLD_SIZE - 4, WORLD_SIZE - 4]} />
        <meshStandardMaterial
          color={new THREE.Color(0.1, 0.7, 1.0)}
          emissive={new THREE.Color(0.1, 0.7, 1.0)}
          emissiveIntensity={0.3}
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={scanRef2}
        position={[0, HALF_WORLD, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[WORLD_SIZE - 4, WORLD_SIZE - 4]} />
        <meshStandardMaterial
          color={new THREE.Color(0.05, 0.4, 0.9)}
          emissive={new THREE.Color(0.05, 0.4, 0.9)}
          emissiveIntensity={0.2}
          transparent
          opacity={0.02}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

// ─── Minimap Overlay ──────────────────────────────────────────────────────────

function Minimap({ avatarPos }: { avatarPos: { x: number; z: number } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 120;
    const H = 120;
    const cx = W / 2;
    const cy = H / 2;
    const scale = (W - 12) / WORLD_SIZE;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "rgba(5, 8, 20, 0.92)";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(30, 90, 200, 0.6)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
    ctx.strokeStyle = "rgba(30, 80, 160, 0.3)";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(6, 6, W - 12, H - 12);

    const objDotColors: Record<string, string> = {
      light_node: "rgba(0, 220, 255, 0.9)",
      reward_node: "rgba(255, 210, 20, 0.9)",
      threat: "rgba(255, 40, 40, 0.9)",
      memory_marker: "rgba(0, 255, 230, 0.9)",
      temp_zone: "rgba(255, 120, 20, 0.9)",
      food_node_1: "rgba(30, 220, 60, 0.9)",
      food_node_2: "rgba(30, 200, 70, 0.9)",
      food_node_3: "rgba(30, 210, 80, 0.9)",
      novel_object: "rgba(0, 230, 255, 0.9)",
      social_mirror: "rgba(200, 200, 220, 0.9)",
    };
    for (const obj of ENV_OBJECTS) {
      const mx = cx + obj.position[0] * scale;
      const my = cy + obj.position[2] * scale;
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fillStyle = objDotColors[obj.id] ?? "rgba(200,200,200,0.7)";
      ctx.fill();
    }

    for (const { pos: obs } of OBSTACLE_POSITIONS) {
      const mx = cx + obs[0] * scale;
      const my = cy + obs[2] * scale;
      ctx.fillStyle = "rgba(80, 40, 120, 0.7)";
      ctx.fillRect(mx - 2, my - 2, 4, 4);
    }

    const ax = cx + avatarPos.x * scale;
    const ay = cy + avatarPos.z * scale;
    ctx.beginPath();
    ctx.arc(ax, ay, 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 1.0)";
    ctx.fill();

    ctx.fillStyle = "rgba(60, 140, 255, 0.8)";
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "center";
    ctx.fillText("N", cx, 12);
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: "8px",
        right: "8px",
        width: "120px",
        height: "120px",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <canvas
        ref={canvasRef}
        width={120}
        height={120}
        style={{ display: "block" }}
      />
      <div
        style={{
          position: "absolute",
          top: "2px",
          left: "4px",
          fontFamily: "monospace",
          fontSize: "6px",
          color: "rgba(60, 140, 255, 0.7)",
          letterSpacing: "0.05em",
        }}
      >
        MINIMAP · 50³ WORLD
      </div>
    </div>
  );
}

// ─── Avatar Follow Camera ─────────────────────────────────────────────────────

function AvatarFollowCamera({
  avatarPos,
}: {
  avatarPos: { x: number; y: number; z: number };
}) {
  const { camera } = useThree();
  const targetCamPos = useRef(new THREE.Vector3(18, 8, 28));
  const targetLookAt = useRef(new THREE.Vector3(0, -HALF_WORLD + 6, 0));

  useFrame(() => {
    const ax = avatarPos.x;
    const ay = -HALF_WORLD + 6;
    const az = avatarPos.z;

    targetCamPos.current.set(ax + 5, ay + 12, az + 20);
    targetLookAt.current.set(ax, ay + 2, az);

    camera.position.lerp(targetCamPos.current, 0.04);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function WorldCube({
  avatarBehavior,
  isRunning,
  onProximityStimulus,
  regionActivations,
  latestThought,
  latestThoughtEntry,
}: WorldCubeProps) {
  const [cameraMode, setCameraMode] = useState<"free" | "track">("free");

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, -12, 38], fov: 60 }}
        gl={{ antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight
          intensity={0.5}
          color={new THREE.Color(0.15, 0.25, 0.5)}
        />
        <pointLight
          position={[20, 20, 20]}
          intensity={3}
          color={new THREE.Color(0.2, 0.6, 1.0)}
        />
        <pointLight
          position={[-16, -5, -16]}
          intensity={2}
          color={new THREE.Color(0.8, 0.3, 0.1)}
        />
        {/* Fill light at avatar height */}
        <pointLight
          position={[0, -HALF_WORLD + 8, 0]}
          intensity={4.0}
          color={new THREE.Color(0.3, 0.7, 1.0)}
          distance={35}
        />
        {/* Dedicated strong avatar spotlight */}
        <pointLight
          position={[0, -HALF_WORLD + 14, 8]}
          intensity={5.0}
          color={new THREE.Color(0.5, 0.9, 1.0)}
          distance={25}
        />
        {/* Dynamic avatar tracking light */}
        <pointLight
          position={[
            avatarBehavior.avatarWorldPos.x,
            avatarBehavior.avatarWorldPos.y + 6,
            avatarBehavior.avatarWorldPos.z,
          ]}
          intensity={4.0}
          color={new THREE.Color(0.3, 0.8, 1.0)}
          distance={20}
        />
        <WorldScene
          avatarBehavior={avatarBehavior}
          isRunning={isRunning}
          onProximityStimulus={onProximityStimulus}
          regionActivations={regionActivations}
          latestThought={latestThought}
        />
        {/* Avatar follow camera — only active in track mode */}
        {cameraMode === "track" && (
          <AvatarFollowCamera avatarPos={avatarBehavior.avatarWorldPos} />
        )}
        <OrbitControls
          enabled={cameraMode === "free"}
          enableZoom={true}
          enablePan={false}
          autoRotate={cameraMode === "free"}
          autoRotateSpeed={0.4}
          minDistance={10}
          maxDistance={80}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={(Math.PI * 5) / 8}
        />
      </Canvas>

      {/* Camera mode toggle button — overlaid on canvas top-left */}
      <button
        type="button"
        data-ocid="world.camera_toggle"
        onClick={() => setCameraMode((m) => (m === "free" ? "track" : "free"))}
        className="absolute top-2 left-2 font-mono text-[8px] tracking-widest uppercase flex items-center gap-1 px-2 py-1 transition-all"
        style={{
          zIndex: 20,
          border: `1px solid ${cameraMode === "track" ? "oklch(0.72 0.22 195)" : "oklch(0.28 0.06 250)"}`,
          background:
            cameraMode === "track"
              ? "oklch(0.72 0.22 195 / 0.15)"
              : "oklch(0.08 0.015 260 / 0.88)",
          color:
            cameraMode === "track"
              ? "oklch(0.85 0.22 195)"
              : "oklch(0.45 0.08 220)",
          boxShadow:
            cameraMode === "track"
              ? "0 0 10px oklch(0.72 0.22 195 / 0.4)"
              : "none",
        }}
      >
        <svg
          width="9"
          height="9"
          viewBox="0 0 9 9"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="4.5"
            cy="4.5"
            r="3.5"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="4.5" cy="4.5" r="1.2" fill="currentColor" />
        </svg>
        {cameraMode === "track" ? "TRACK" : "FREE"}
      </button>

      <Minimap avatarPos={avatarBehavior.avatarWorldPos} />
      {/* Thought overlay — HTML element outside canvas, no font loading required */}
      {latestThought && (
        <div
          style={{
            position: "absolute",
            top: "36px",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "monospace",
            fontSize: "10px",
            color: "oklch(0.78 0.22 195)",
            background: "oklch(0.07 0.015 265 / 0.92)",
            border: "2px solid oklch(0.32 0.12 210)",
            padding: "5px 10px",
            letterSpacing: "0.04em",
            pointerEvents: "none",
            zIndex: 15,
            maxWidth: "280px",
            textAlign: "left",
            whiteSpace: "normal",
            wordWrap: "break-word",
            animation: "thoughtPulse 1.5s ease-in-out",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}
          >
            <span style={{ color: "oklch(0.72 0.22 195)", flexShrink: 0 }}>
              ◈
            </span>
            <span>{latestThought}</span>
          </div>
          {latestThoughtEntry && (
            <div
              style={{
                fontSize: "8px",
                color: "oklch(0.45 0.08 195)",
                marginTop: "3px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {latestThoughtEntry.dominantRegion
                .replace(/([A-Z])/g, " $1")
                .trim()}{" "}
              · T{latestThoughtEntry.tick}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
