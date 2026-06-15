import { Line, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  useCanonicalState,
  useEcologyState,
  useSubOrganismState,
} from "../hooks/useQueries";

// Fibonacci sphere - evenly distributes 12 points on a sphere
function fibonacciSphere(
  n: number,
  radius: number,
): [number, number, number][] {
  const points: [number, number, number][] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < n; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / n);
    const phi = (2 * Math.PI * i) / goldenRatio;
    points.push([
      radius * Math.sin(theta) * Math.cos(phi),
      radius * Math.cos(theta),
      radius * Math.sin(theta) * Math.sin(phi),
    ]);
  }
  return points;
}

const NODE_POSITIONS = fibonacciSphere(12, 2.2);

// Color constants as hex (canvas/WebGL can't use CSS vars)
const COLOR_CYAN = new THREE.Color(0x00e5ff);
const COLOR_GOLD = new THREE.Color(0xd4a017);
const COLOR_DIM = new THREE.Color(0x1a2a40);
const COLOR_GREEN = new THREE.Color(0x00c94e);
const COLOR_BG = new THREE.Color(0x050811);

function ConnectomeNode({
  position,
  hz,
  isOmnis,
  isSovereign,
}: {
  position: [number, number, number];
  hz: number;
  isOmnis: boolean;
  isSovereign: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const baseIntensity = isSovereign ? hz * 1.5 : hz;
  const color = isOmnis
    ? COLOR_GOLD
    : hz > 0.7
      ? COLOR_CYAN
      : hz > 0.4
        ? COLOR_GREEN
        : COLOR_DIM;
  const size = 0.06 + hz * 0.12;

  useFrame(() => {
    if (!meshRef.current) return;
    if (isOmnis) {
      const s = 1 + Math.sin(Date.now() * 0.003) * 0.15;
      meshRef.current.scale.setScalar(s);
    } else {
      meshRef.current.scale.setScalar(1);
    }
    // Gentle float
    meshRef.current.position.y =
      position[1] + Math.sin(Date.now() * 0.0005 + position[0]) * 0.03;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4 + baseIntensity * 0.8}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        color={color}
        intensity={baseIntensity * 0.4}
        distance={1.5}
        decay={2}
      />
    </group>
  );
}

function ConnectomeLines({
  hz,
  isOmnis,
  aresActive,
}: {
  hz: number[];
  isOmnis: boolean;
  aresActive: boolean;
}) {
  const flashRef = useRef(0);

  useFrame(() => {
    if (aresActive) flashRef.current = 1;
    else flashRef.current = Math.max(0, flashRef.current - 0.02);
  });

  const lines = useMemo(() => {
    const result: {
      points: [[number, number, number], [number, number, number]];
      opacity: number;
      key: string;
    }[] = [];
    for (let i = 0; i < 12; i++) {
      for (let j = i + 1; j < 12; j++) {
        const baseOp = (hz[i] ?? 0) * (hz[j] ?? 0) * 0.6;
        if (baseOp > 0.02) {
          result.push({
            points: [NODE_POSITIONS[i], NODE_POSITIONS[j]],
            opacity: Math.min(1, baseOp + flashRef.current * 0.5),
            key: `${i}-${j}`,
          });
        }
      }
    }
    return result;
  }, [hz]);

  const lineColor = aresActive
    ? new THREE.Color(0xffffff)
    : isOmnis
      ? COLOR_GOLD
      : COLOR_CYAN;

  return (
    <>
      {lines.map(({ points, opacity, key }) => (
        <Line
          key={key}
          points={points}
          color={lineColor}
          lineWidth={1}
          transparent
          opacity={opacity}
        />
      ))}
    </>
  );
}

function ConnectomeScene({
  hz,
  isOmnis,
  aresActive,
  isSovereign,
}: {
  hz: number[];
  isOmnis: boolean;
  aresActive: boolean;
  isSovereign: boolean;
}) {
  return (
    <>
      <color attach="background" args={[COLOR_BG]} />
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={0.3} color={COLOR_CYAN} />
      <pointLight position={[-5, -5, -5]} intensity={0.2} color={COLOR_GOLD} />

      <ConnectomeLines hz={hz} isOmnis={isOmnis} aresActive={aresActive} />

      {NODE_POSITIONS.map((pos, i) => (
        <ConnectomeNode
          // biome-ignore lint/suspicious/noArrayIndexKey: static fibonacci positions never reorder
          key={i}
          position={pos}
          hz={hz[i] ?? 0.5}
          isOmnis={isOmnis}
          isSovereign={isSovereign}
        />
      ))}

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        minDistance={3}
        maxDistance={10}
      />
    </>
  );
}

export default function Connectome3D({ fullscreen }: { fullscreen: boolean }) {
  const canonicalQ = useCanonicalState();
  const ecologyQ = useEcologyState();
  const subOrgQ = useSubOrganismState();

  const isOmnis = canonicalQ.data?.eg ?? false;
  const hz = (ecologyQ.data?.freqs ?? [])
    .slice(0, 12)
    .map((v) => Math.min(1, Math.max(0, v)));
  while (hz.length < 12) hz.push(0.5);
  const aresActive = subOrgQ.data?.aresActive ?? false;
  const isSovereign = subOrgQ.data?.sentActive ?? false;

  return (
    <Canvas
      style={{
        height: fullscreen ? "100vh" : "280px",
        width: "100%",
        background: "#050811",
      }}
      camera={{ position: [0, 0, 7], fov: 60 }}
      gl={{ antialias: true, alpha: false }}
    >
      <ConnectomeScene
        hz={hz}
        isOmnis={isOmnis}
        aresActive={aresActive}
        isSovereign={isSovereign}
      />
    </Canvas>
  );
}
