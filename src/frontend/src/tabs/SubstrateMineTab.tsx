import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  type MineDeposit,
  useManualMineDeposit,
  useSubstrateMineState,
} from "../hooks/useQueries";

const PHI = 1.6180339887;

// PHI-noise deterministic terrain height
function phiNoise(x: number, z: number): number {
  const s1 = Math.sin(x * 0.018 * PHI + z * 0.013) * 0.5;
  const s2 = Math.sin(x * 0.031 + z * 0.027 * PHI) * 0.3;
  const s3 = Math.sin((x + z) * 0.009 * PHI * PHI) * 0.2;
  return (s1 + s2 + s3) * 18;
}

const DEPOSIT_COLORS: Record<string, string> = {
  DopamineVein: "#d4a017",
  SerotoninVein: "#3b82f6",
  EndorphinCrystal: "#e2e8f0",
  CortisolHazard: "#ef4444",
  AcetylcholineOre: "#a855f7",
  GABADeposit: "#22c55e",
};

const DEPOSIT_COLORS_THREE: Record<string, number> = {
  DopamineVein: 0xd4a017,
  SerotoninVein: 0x3b82f6,
  EndorphinCrystal: 0xe2e8f0,
  CortisolHazard: 0xef4444,
  AcetylcholineOre: 0xa855f7,
  GABADeposit: 0x22c55e,
};

const AVATAR_COLORS: Record<string, number> = {
  AXIOM: 0x00e5ff,
  PHANTOM: 0xa78bfa,
  SENTINEL: 0x4ade80,
  FLUX: 0xfbbf24,
};

export default function SubstrateMineTab() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>(0);
  const depositMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const avatarMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());

  // Orbit state
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const orbitRef = useRef({ theta: 0.5, phi: 1.0, radius: 420 });

  const [selectedDeposit, setSelectedDeposit] = useState<MineDeposit | null>(
    null,
  );

  const { data: mineState } = useSubstrateMineState();
  const mineMutation = useManualMineDeposit();

  const tick = mineState?.tick ?? 0;
  const totalExtracted = mineState?.totalExtracted ?? 0;
  const dominantMineral = mineState?.dominantMineral ?? "DopamineVein";
  const deposits = mineState?.deposits ?? [];
  const avatarPositions = mineState?.avatarPositions ?? [];

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;
    const container = canvasRef.current;
    const W = container.clientWidth || 800;
    const H = container.clientHeight || 500;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040810);
    scene.fog = new THREE.Fog(0x040810, 300, 700);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(55, W / H, 0.5, 1200);
    cameraRef.current = camera;

    // Ambient + directional light
    scene.add(new THREE.AmbientLight(0x1a2040, 0.6));
    const dir = new THREE.DirectionalLight(0x4080ff, 0.8);
    dir.position.set(100, 200, 100);
    scene.add(dir);

    // Terrain
    const SEGS = 60;
    const SIZE = 600;
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGS, SEGS);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, phiNoise(x, z));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    const terrainMat = new THREE.MeshLambertMaterial({
      color: 0x0d1a0d,
      wireframe: false,
    });
    const terrain = new THREE.Mesh(geo, terrainMat);
    scene.add(terrain);

    // Grid overlay
    const gridHelper = new THREE.GridHelper(600, 30, 0x112211, 0x0a150a);
    gridHelper.position.y = 0.5;
    scene.add(gridHelper);

    // Animate
    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      const o = orbitRef.current;
      const cx = o.radius * Math.sin(o.phi) * Math.sin(o.theta);
      const cy = o.radius * Math.cos(o.phi);
      const cz = o.radius * Math.sin(o.phi) * Math.cos(o.theta);
      camera.position.set(cx, cy, cz);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    animate();

    // Resize
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  // Sync deposits into scene
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const existing = depositMeshesRef.current;

    // Remove old
    for (const [id, mesh] of existing) {
      if (!deposits.find((d) => d.id === id)) {
        scene.remove(mesh);
        existing.delete(id);
      }
    }

    for (const dep of deposits) {
      if (!existing.has(dep.id)) {
        const color = DEPOSIT_COLORS_THREE[dep.type] ?? 0xffffff;
        const geo = new THREE.SphereGeometry(8 + (dep.amount / 340) * 6, 8, 8);
        const mat = new THREE.MeshLambertMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.4,
        });
        const mesh = new THREE.Mesh(geo, mat);
        const y = phiNoise(dep.x, dep.z) + 8;
        mesh.position.set(dep.x, y, dep.z);
        mesh.userData = { depositId: dep.id };
        scene.add(mesh);
        existing.set(dep.id, mesh);

        // Point light for glow
        const pl = new THREE.PointLight(color, 1.5, 80);
        pl.position.copy(mesh.position);
        scene.add(pl);
      }
    }
  }, [deposits]);

  // Sync avatar positions
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const existing = avatarMeshesRef.current;

    for (const av of avatarPositions) {
      const color = AVATAR_COLORS[av.id] ?? 0xffffff;
      if (!existing.has(av.id)) {
        const geo = new THREE.SphereGeometry(5, 8, 8);
        const mat = new THREE.MeshLambertMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.6,
        });
        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);
        existing.set(av.id, mesh);
      }
      const mesh = existing.get(av.id)!;
      const y = phiNoise(av.x, av.z) + 6;
      mesh.position.set(av.x, y, av.z);
    }
  }, [avatarPositions]);

  // Draw minimap
  useEffect(() => {
    const canvas = minimapRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const S = 120;
    const scale = S / 600;
    const offset = S / 2;

    ctx.clearRect(0, 0, S, S);
    ctx.fillStyle = "#040810";
    ctx.fillRect(0, 0, S, S);
    ctx.strokeStyle = "#1a2a1a";
    ctx.strokeRect(0, 0, S, S);

    for (const dep of deposits) {
      const col = DEPOSIT_COLORS[dep.type] ?? "#fff";
      const px = dep.x * scale + offset;
      const pz = dep.z * scale + offset;
      ctx.beginPath();
      ctx.arc(px, pz, 4, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    }

    for (const av of avatarPositions) {
      const col = `#${(AVATAR_COLORS[av.id] ?? 0xffffff).toString(16).padStart(6, "0")}`;
      const px = av.x * scale + offset;
      const pz = av.z * scale + offset;
      ctx.beginPath();
      ctx.arc(px, pz, 3, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
      ctx.fillStyle = "#aaa";
      ctx.font = "7px monospace";
      ctx.fillText(av.id[0], px + 4, pz + 3);
    }
  }, [deposits, avatarPositions]);

  // Click on 3D canvas — raycasting for deposit selection
  function handleCanvasClick(e: React.MouseEvent) {
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    if (!renderer || !camera || !scene) return;
    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const meshes = Array.from(depositMeshesRef.current.values());
    const hits = raycaster.intersectObjects(meshes);
    if (hits.length > 0) {
      const id = hits[0].object.userData.depositId as string;
      const dep = deposits.find((d) => d.id === id) ?? null;
      setSelectedDeposit(dep);
    } else {
      setSelectedDeposit(null);
    }
  }

  // Orbit drag handlers
  function onMouseDown(e: React.MouseEvent) {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    orbitRef.current.theta -= dx * 0.006;
    orbitRef.current.phi = Math.max(
      0.2,
      Math.min(1.4, orbitRef.current.phi + dy * 0.006),
    );
  }
  function onMouseUp() {
    isDraggingRef.current = false;
  }
  function onWheel(e: React.WheelEvent) {
    orbitRef.current.radius = Math.max(
      100,
      Math.min(700, orbitRef.current.radius + e.deltaY * 0.4),
    );
  }

  return (
    <div
      data-ocid="substratemine.page"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "oklch(0.055 0.012 265)",
        overflow: "hidden",
      }}
    >
      {/* 3D canvas */}
      <div
        ref={canvasRef}
        data-ocid="substratemine.canvas_target"
        style={{
          flex: 1,
          minHeight: 0,
          cursor: isDraggingRef.current ? "grabbing" : "grab",
          position: "relative",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onClick={handleCanvasClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            handleCanvasClick(e as unknown as React.MouseEvent);
        }}
        role="presentation"
      >
        {/* Minimap */}
        <canvas
          ref={minimapRef}
          width={120}
          height={120}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            border: "1px solid oklch(0.22 0.06 240)",
            borderRadius: 4,
            zIndex: 10,
          }}
        />

        {/* Selected deposit mine panel */}
        {selectedDeposit && (
          <div
            data-ocid="substratemine.deposit.panel"
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "oklch(0.11 0.025 260 / 0.92)",
              border: "1px solid oklch(0.24 0.07 240)",
              borderRadius: 6,
              padding: "10px 14px",
              zIndex: 10,
              minWidth: 180,
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                letterSpacing: "0.15em",
                color: "oklch(0.62 0.18 195)",
                marginBottom: 6,
              }}
            >
              DEPOSIT SELECTED
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                fontWeight: 700,
                color: DEPOSIT_COLORS[selectedDeposit.type] ?? "#fff",
                marginBottom: 2,
              }}
            >
              {selectedDeposit.type}
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                color: "oklch(0.5 0.06 220)",
                marginBottom: 8,
              }}
            >
              Amount: {selectedDeposit.amount} units
            </div>
            <button
              type="button"
              data-ocid="substratemine.mine_button"
              onClick={() => {
                mineMutation.mutate(selectedDeposit.id);
                setSelectedDeposit(null);
              }}
              disabled={mineMutation.isPending}
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                letterSpacing: "0.12em",
                padding: "4px 10px",
                background: "oklch(0.22 0.08 140)",
                border: "1px solid oklch(0.35 0.14 140)",
                borderRadius: 4,
                color: "oklch(0.78 0.22 140)",
                cursor: "pointer",
                opacity: mineMutation.isPending ? 0.5 : 1,
              }}
            >
              {mineMutation.isPending ? "MINING..." : "MINE"}
            </button>
          </div>
        )}

        {/* Legend */}
        <div
          style={{
            position: "absolute",
            bottom: 44,
            right: 10,
            background: "oklch(0.09 0.018 260 / 0.85)",
            border: "1px solid oklch(0.18 0.05 240)",
            borderRadius: 4,
            padding: "6px 8px",
            zIndex: 10,
          }}
        >
          {Object.entries(DEPOSIT_COLORS).map(([type, color]) => (
            <div
              key={type}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginBottom: 2,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: color,
                }}
              />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 7,
                  color: "oklch(0.5 0.05 220)",
                }}
              >
                {type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div
        data-ocid="substratemine.status_bar"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "5px 12px",
          background: "oklch(0.07 0.015 260)",
          borderTop: "1px solid oklch(0.15 0.04 250)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 8,
            color: "oklch(0.42 0.04 220)",
            letterSpacing: "0.08em",
          }}
        >
          TICK
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "oklch(0.72 0.22 195)",
            fontWeight: 700,
          }}
        >
          {tick.toLocaleString()}
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 8,
            color: "oklch(0.42 0.04 220)",
            letterSpacing: "0.08em",
            marginLeft: 8,
          }}
        >
          EXTRACTED
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "oklch(0.82 0.22 80)",
            fontWeight: 700,
          }}
        >
          {totalExtracted.toLocaleString()}
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 8,
            color: "oklch(0.42 0.04 220)",
            letterSpacing: "0.08em",
            marginLeft: 8,
          }}
        >
          DOMINANT
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: DEPOSIT_COLORS[dominantMineral] ?? "oklch(0.72 0.18 195)",
            fontWeight: 700,
          }}
        >
          {dominantMineral}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "monospace",
            fontSize: 7,
            color: "oklch(0.32 0.04 220)",
            letterSpacing: "0.06em",
          }}
        >
          CLICK DEPOSIT TO SELECT — DRAG TO ORBIT — SCROLL TO ZOOM
        </span>
      </div>
    </div>
  );
}
