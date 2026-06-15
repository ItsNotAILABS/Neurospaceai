import { r as reactExports, al as useSubstrateMineState, am as useManualMineDeposit, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
import { W as WebGLRenderer, S as Scene, C as Color, _ as Fog, c as PerspectiveCamera, $ as AmbientLight, a0 as DirectionalLight, a1 as PlaneGeometry, a2 as MeshLambertMaterial, J as Mesh, a3 as GridHelper, a4 as SphereGeometry, a5 as PointLight, R as Raycaster, m as Vector2 } from "./three.module-DHVhg58e.js";
const PHI = 1.6180339887;
function phiNoise(x, z) {
  const s1 = Math.sin(x * 0.018 * PHI + z * 0.013) * 0.5;
  const s2 = Math.sin(x * 0.031 + z * 0.027 * PHI) * 0.3;
  const s3 = Math.sin((x + z) * 9e-3 * PHI * PHI) * 0.2;
  return (s1 + s2 + s3) * 18;
}
const DEPOSIT_COLORS = {
  DopamineVein: "#d4a017",
  SerotoninVein: "#3b82f6",
  EndorphinCrystal: "#e2e8f0",
  CortisolHazard: "#ef4444",
  AcetylcholineOre: "#a855f7",
  GABADeposit: "#22c55e"
};
const DEPOSIT_COLORS_THREE = {
  DopamineVein: 13934615,
  SerotoninVein: 3900150,
  EndorphinCrystal: 14870768,
  CortisolHazard: 15680580,
  AcetylcholineOre: 11032055,
  GABADeposit: 2278750
};
const AVATAR_COLORS = {
  AXIOM: 58879,
  PHANTOM: 10980346,
  SENTINEL: 4906624,
  FLUX: 16498468
};
function SubstrateMineTab() {
  const canvasRef = reactExports.useRef(null);
  const minimapRef = reactExports.useRef(null);
  const sceneRef = reactExports.useRef(null);
  const rendererRef = reactExports.useRef(null);
  const cameraRef = reactExports.useRef(null);
  const frameRef = reactExports.useRef(0);
  const depositMeshesRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const avatarMeshesRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const isDraggingRef = reactExports.useRef(false);
  const lastMouseRef = reactExports.useRef({ x: 0, y: 0 });
  const orbitRef = reactExports.useRef({ theta: 0.5, phi: 1, radius: 420 });
  const [selectedDeposit, setSelectedDeposit] = reactExports.useState(
    null
  );
  const { data: mineState } = useSubstrateMineState();
  const mineMutation = useManualMineDeposit();
  const tick = (mineState == null ? void 0 : mineState.tick) ?? 0;
  const totalExtracted = (mineState == null ? void 0 : mineState.totalExtracted) ?? 0;
  const dominantMineral = (mineState == null ? void 0 : mineState.dominantMineral) ?? "DopamineVein";
  const deposits = (mineState == null ? void 0 : mineState.deposits) ?? [];
  const avatarPositions = (mineState == null ? void 0 : mineState.avatarPositions) ?? [];
  reactExports.useEffect(() => {
    if (!canvasRef.current) return;
    const container = canvasRef.current;
    const W = container.clientWidth || 800;
    const H = container.clientHeight || 500;
    const renderer = new WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    const scene = new Scene();
    scene.background = new Color(264208);
    scene.fog = new Fog(264208, 300, 700);
    sceneRef.current = scene;
    const camera = new PerspectiveCamera(55, W / H, 0.5, 1200);
    cameraRef.current = camera;
    scene.add(new AmbientLight(1712192, 0.6));
    const dir = new DirectionalLight(4227327, 0.8);
    dir.position.set(100, 200, 100);
    scene.add(dir);
    const SEGS = 60;
    const SIZE = 600;
    const geo = new PlaneGeometry(SIZE, SIZE, SEGS, SEGS);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, phiNoise(x, z));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    const terrainMat = new MeshLambertMaterial({
      color: 858637,
      wireframe: false
    });
    const terrain = new Mesh(geo, terrainMat);
    scene.add(terrain);
    const gridHelper = new GridHelper(600, 30, 1122833, 660746);
    gridHelper.position.y = 0.5;
    scene.add(gridHelper);
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
  reactExports.useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const existing = depositMeshesRef.current;
    for (const [id, mesh] of existing) {
      if (!deposits.find((d) => d.id === id)) {
        scene.remove(mesh);
        existing.delete(id);
      }
    }
    for (const dep of deposits) {
      if (!existing.has(dep.id)) {
        const color = DEPOSIT_COLORS_THREE[dep.type] ?? 16777215;
        const geo = new SphereGeometry(8 + dep.amount / 340 * 6, 8, 8);
        const mat = new MeshLambertMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.4
        });
        const mesh = new Mesh(geo, mat);
        const y = phiNoise(dep.x, dep.z) + 8;
        mesh.position.set(dep.x, y, dep.z);
        mesh.userData = { depositId: dep.id };
        scene.add(mesh);
        existing.set(dep.id, mesh);
        const pl = new PointLight(color, 1.5, 80);
        pl.position.copy(mesh.position);
        scene.add(pl);
      }
    }
  }, [deposits]);
  reactExports.useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const existing = avatarMeshesRef.current;
    for (const av of avatarPositions) {
      const color = AVATAR_COLORS[av.id] ?? 16777215;
      if (!existing.has(av.id)) {
        const geo = new SphereGeometry(5, 8, 8);
        const mat = new MeshLambertMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.6
        });
        const mesh2 = new Mesh(geo, mat);
        scene.add(mesh2);
        existing.set(av.id, mesh2);
      }
      const mesh = existing.get(av.id);
      const y = phiNoise(av.x, av.z) + 6;
      mesh.position.set(av.x, y, av.z);
    }
  }, [avatarPositions]);
  reactExports.useEffect(() => {
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
      const col = `#${(AVATAR_COLORS[av.id] ?? 16777215).toString(16).padStart(6, "0")}`;
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
  function handleCanvasClick(e) {
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    if (!renderer || !camera || !scene) return;
    const rect = renderer.domElement.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    const raycaster = new Raycaster();
    raycaster.setFromCamera(new Vector2(x, y), camera);
    const meshes = Array.from(depositMeshesRef.current.values());
    const hits = raycaster.intersectObjects(meshes);
    if (hits.length > 0) {
      const id = hits[0].object.userData.depositId;
      const dep = deposits.find((d) => d.id === id) ?? null;
      setSelectedDeposit(dep);
    } else {
      setSelectedDeposit(null);
    }
  }
  function onMouseDown(e) {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  }
  function onMouseMove(e) {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    orbitRef.current.theta -= dx * 6e-3;
    orbitRef.current.phi = Math.max(
      0.2,
      Math.min(1.4, orbitRef.current.phi + dy * 6e-3)
    );
  }
  function onMouseUp() {
    isDraggingRef.current = false;
  }
  function onWheel(e) {
    orbitRef.current.radius = Math.max(
      100,
      Math.min(700, orbitRef.current.radius + e.deltaY * 0.4)
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "substratemine.page",
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "oklch(0.055 0.012 265)",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: canvasRef,
            "data-ocid": "substratemine.canvas_target",
            style: {
              flex: 1,
              minHeight: 0,
              cursor: isDraggingRef.current ? "grabbing" : "grab",
              position: "relative"
            },
            onMouseDown,
            onMouseMove,
            onMouseUp,
            onMouseLeave: onMouseUp,
            onWheel,
            onClick: handleCanvasClick,
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ")
                handleCanvasClick(e);
            },
            role: "presentation",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "canvas",
                {
                  ref: minimapRef,
                  width: 120,
                  height: 120,
                  style: {
                    position: "absolute",
                    top: 10,
                    right: 10,
                    border: "1px solid oklch(0.22 0.06 240)",
                    borderRadius: 4,
                    zIndex: 10
                  }
                }
              ),
              selectedDeposit && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "substratemine.deposit.panel",
                  style: {
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: "oklch(0.11 0.025 260 / 0.92)",
                    border: "1px solid oklch(0.24 0.07 240)",
                    borderRadius: 6,
                    padding: "10px 14px",
                    zIndex: 10,
                    minWidth: 180
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontFamily: "monospace",
                          fontSize: 9,
                          letterSpacing: "0.15em",
                          color: "oklch(0.62 0.18 195)",
                          marginBottom: 6
                        },
                        children: "DEPOSIT SELECTED"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontFamily: "monospace",
                          fontSize: 10,
                          fontWeight: 700,
                          color: DEPOSIT_COLORS[selectedDeposit.type] ?? "#fff",
                          marginBottom: 2
                        },
                        children: selectedDeposit.type
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          fontFamily: "monospace",
                          fontSize: 8,
                          color: "oklch(0.5 0.06 220)",
                          marginBottom: 8
                        },
                        children: [
                          "Amount: ",
                          selectedDeposit.amount,
                          " units"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "substratemine.mine_button",
                        onClick: () => {
                          mineMutation.mutate(selectedDeposit.id);
                          setSelectedDeposit(null);
                        },
                        disabled: mineMutation.isPending,
                        style: {
                          fontFamily: "monospace",
                          fontSize: 8,
                          letterSpacing: "0.12em",
                          padding: "4px 10px",
                          background: "oklch(0.22 0.08 140)",
                          border: "1px solid oklch(0.35 0.14 140)",
                          borderRadius: 4,
                          color: "oklch(0.78 0.22 140)",
                          cursor: "pointer",
                          opacity: mineMutation.isPending ? 0.5 : 1
                        },
                        children: mineMutation.isPending ? "MINING..." : "MINE"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    bottom: 44,
                    right: 10,
                    background: "oklch(0.09 0.018 260 / 0.85)",
                    border: "1px solid oklch(0.18 0.05 240)",
                    borderRadius: 4,
                    padding: "6px 8px",
                    zIndex: 10
                  },
                  children: Object.entries(DEPOSIT_COLORS).map(([type, color]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        marginBottom: 2
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: color
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            style: {
                              fontFamily: "monospace",
                              fontSize: 7,
                              color: "oklch(0.5 0.05 220)"
                            },
                            children: type
                          }
                        )
                      ]
                    },
                    type
                  ))
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "substratemine.status_bar",
            style: {
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "5px 12px",
              background: "oklch(0.07 0.015 260)",
              borderTop: "1px solid oklch(0.15 0.04 250)",
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 8,
                    color: "oklch(0.42 0.04 220)",
                    letterSpacing: "0.08em"
                  },
                  children: "TICK"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 9,
                    color: "oklch(0.72 0.22 195)",
                    fontWeight: 700
                  },
                  children: tick.toLocaleString()
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 8,
                    color: "oklch(0.42 0.04 220)",
                    letterSpacing: "0.08em",
                    marginLeft: 8
                  },
                  children: "EXTRACTED"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 9,
                    color: "oklch(0.82 0.22 80)",
                    fontWeight: 700
                  },
                  children: totalExtracted.toLocaleString()
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 8,
                    color: "oklch(0.42 0.04 220)",
                    letterSpacing: "0.08em",
                    marginLeft: 8
                  },
                  children: "DOMINANT"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 9,
                    color: DEPOSIT_COLORS[dominantMineral] ?? "oklch(0.72 0.18 195)",
                    fontWeight: 700
                  },
                  children: dominantMineral
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    marginLeft: "auto",
                    fontFamily: "monospace",
                    fontSize: 7,
                    color: "oklch(0.32 0.04 220)",
                    letterSpacing: "0.06em"
                  },
                  children: "CLICK DEPOSIT TO SELECT — DRAG TO ORBIT — SCROLL TO ZOOM"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  SubstrateMineTab as default
};
