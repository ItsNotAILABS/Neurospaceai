var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { r as reactExports, af as clientExports, a0 as liveBrainBus, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
import { a as useThree, u as useFrame, _ as _extends, C as Canvas, O as OrbitControls } from "./OrbitControls-CwmRBLxw.js";
import { V as Vector3, D as DoubleSide, m as Vector2, c as PerspectiveCamera, O as OrthographicCamera, q as Quaternion } from "./three.module-DHVhg58e.js";
const v1 = /* @__PURE__ */ new Vector3();
const v2 = /* @__PURE__ */ new Vector3();
const v3 = /* @__PURE__ */ new Vector3();
const v4 = /* @__PURE__ */ new Vector2();
function defaultCalculatePosition(el, camera, size) {
  const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
  objectPos.project(camera);
  const widthHalf = size.width / 2;
  const heightHalf = size.height / 2;
  return [objectPos.x * widthHalf + widthHalf, -(objectPos.y * heightHalf) + heightHalf];
}
function isObjectBehindCamera(el, camera) {
  const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
  const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
  const deltaCamObj = objectPos.sub(cameraPos);
  const camDir = camera.getWorldDirection(v3);
  return deltaCamObj.angleTo(camDir) > Math.PI / 2;
}
function isObjectVisible(el, camera, raycaster, occlude) {
  const elPos = v1.setFromMatrixPosition(el.matrixWorld);
  const screenPos = elPos.clone();
  screenPos.project(camera);
  v4.set(screenPos.x, screenPos.y);
  raycaster.setFromCamera(v4, camera);
  const intersects = raycaster.intersectObjects(occlude, true);
  if (intersects.length) {
    const intersectionDistance = intersects[0].distance;
    const pointDistance = elPos.distanceTo(raycaster.ray.origin);
    return pointDistance < intersectionDistance;
  }
  return true;
}
function objectScale(el, camera) {
  if (camera instanceof OrthographicCamera) {
    return camera.zoom;
  } else if (camera instanceof PerspectiveCamera) {
    const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
    const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
    const vFOV = camera.fov * Math.PI / 180;
    const dist = objectPos.distanceTo(cameraPos);
    const scaleFOV = 2 * Math.tan(vFOV / 2) * dist;
    return 1 / scaleFOV;
  } else {
    return 1;
  }
}
function objectZIndex(el, camera, zIndexRange) {
  if (camera instanceof PerspectiveCamera || camera instanceof OrthographicCamera) {
    const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
    const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
    const dist = objectPos.distanceTo(cameraPos);
    const A = (zIndexRange[1] - zIndexRange[0]) / (camera.far - camera.near);
    const B = zIndexRange[1] - A * camera.far;
    return Math.round(A * dist + B);
  }
  return void 0;
}
const epsilon = (value) => Math.abs(value) < 1e-10 ? 0 : value;
function getCSSMatrix(matrix, multipliers, prepend = "") {
  let matrix3d = "matrix3d(";
  for (let i = 0; i !== 16; i++) {
    matrix3d += epsilon(multipliers[i] * matrix.elements[i]) + (i !== 15 ? "," : ")");
  }
  return prepend + matrix3d;
}
const getCameraCSSMatrix = /* @__PURE__ */ ((multipliers) => {
  return (matrix) => getCSSMatrix(matrix, multipliers);
})([1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1]);
const getObjectCSSMatrix = /* @__PURE__ */ ((scaleMultipliers) => {
  return (matrix, factor) => getCSSMatrix(matrix, scaleMultipliers(factor), "translate(-50%,-50%)");
})((f) => [1 / f, 1 / f, 1 / f, 1, -1 / f, -1 / f, -1 / f, -1, 1 / f, 1 / f, 1 / f, 1, 1, 1, 1, 1]);
function isRefObject(ref) {
  return ref && typeof ref === "object" && "current" in ref;
}
const Html = /* @__PURE__ */ reactExports.forwardRef(({
  children,
  eps = 1e-3,
  style,
  className,
  prepend,
  center,
  fullscreen,
  portal,
  distanceFactor,
  sprite = false,
  transform = false,
  occlude,
  onOcclude,
  castShadow,
  receiveShadow,
  material,
  geometry,
  zIndexRange = [16777271, 0],
  calculatePosition = defaultCalculatePosition,
  as = "div",
  wrapperClass,
  pointerEvents = "auto",
  ...props
}, ref) => {
  const {
    gl,
    camera,
    scene,
    size,
    raycaster,
    events,
    viewport
  } = useThree();
  const [el] = reactExports.useState(() => document.createElement(as));
  const root = reactExports.useRef(null);
  const group = reactExports.useRef(null);
  const oldZoom = reactExports.useRef(0);
  const oldPosition = reactExports.useRef([0, 0]);
  const transformOuterRef = reactExports.useRef(null);
  const transformInnerRef = reactExports.useRef(null);
  const target = (portal == null ? void 0 : portal.current) || events.connected || gl.domElement.parentNode;
  const occlusionMeshRef = reactExports.useRef(null);
  const isMeshSizeSet = reactExports.useRef(false);
  const isRayCastOcclusion = reactExports.useMemo(() => {
    return occlude && occlude !== "blending" || Array.isArray(occlude) && occlude.length && isRefObject(occlude[0]);
  }, [occlude]);
  reactExports.useLayoutEffect(() => {
    const el2 = gl.domElement;
    if (occlude && occlude === "blending") {
      el2.style.zIndex = `${Math.floor(zIndexRange[0] / 2)}`;
      el2.style.position = "absolute";
      el2.style.pointerEvents = "none";
    } else {
      el2.style.zIndex = null;
      el2.style.position = null;
      el2.style.pointerEvents = null;
    }
  }, [occlude]);
  reactExports.useLayoutEffect(() => {
    if (group.current) {
      const currentRoot = root.current = clientExports.createRoot(el);
      scene.updateMatrixWorld();
      if (transform) {
        el.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;`;
      } else {
        const vec = calculatePosition(group.current, camera, size);
        el.style.cssText = `position:absolute;top:0;left:0;transform:translate3d(${vec[0]}px,${vec[1]}px,0);transform-origin:0 0;`;
      }
      if (target) {
        if (prepend) target.prepend(el);
        else target.appendChild(el);
      }
      return () => {
        if (target) target.removeChild(el);
        currentRoot.unmount();
      };
    }
  }, [target, transform]);
  reactExports.useLayoutEffect(() => {
    if (wrapperClass) el.className = wrapperClass;
  }, [wrapperClass]);
  const styles = reactExports.useMemo(() => {
    if (transform) {
      return {
        position: "absolute",
        top: 0,
        left: 0,
        width: size.width,
        height: size.height,
        transformStyle: "preserve-3d",
        pointerEvents: "none"
      };
    } else {
      return {
        position: "absolute",
        transform: center ? "translate3d(-50%,-50%,0)" : "none",
        ...fullscreen && {
          top: -size.height / 2,
          left: -size.width / 2,
          width: size.width,
          height: size.height
        },
        ...style
      };
    }
  }, [style, center, fullscreen, size, transform]);
  const transformInnerStyles = reactExports.useMemo(() => ({
    position: "absolute",
    pointerEvents
  }), [pointerEvents]);
  reactExports.useLayoutEffect(() => {
    isMeshSizeSet.current = false;
    if (transform) {
      var _root$current;
      (_root$current = root.current) == null || _root$current.render(/* @__PURE__ */ reactExports.createElement("div", {
        ref: transformOuterRef,
        style: styles
      }, /* @__PURE__ */ reactExports.createElement("div", {
        ref: transformInnerRef,
        style: transformInnerStyles
      }, /* @__PURE__ */ reactExports.createElement("div", {
        ref,
        className,
        style,
        children
      }))));
    } else {
      var _root$current2;
      (_root$current2 = root.current) == null || _root$current2.render(/* @__PURE__ */ reactExports.createElement("div", {
        ref,
        style: styles,
        className,
        children
      }));
    }
  });
  const visible = reactExports.useRef(true);
  useFrame((gl2) => {
    if (group.current) {
      camera.updateMatrixWorld();
      group.current.updateWorldMatrix(true, false);
      const vec = transform ? oldPosition.current : calculatePosition(group.current, camera, size);
      if (transform || Math.abs(oldZoom.current - camera.zoom) > eps || Math.abs(oldPosition.current[0] - vec[0]) > eps || Math.abs(oldPosition.current[1] - vec[1]) > eps) {
        const isBehindCamera = isObjectBehindCamera(group.current, camera);
        let raytraceTarget = false;
        if (isRayCastOcclusion) {
          if (Array.isArray(occlude)) {
            raytraceTarget = occlude.map((item) => item.current);
          } else if (occlude !== "blending") {
            raytraceTarget = [scene];
          }
        }
        const previouslyVisible = visible.current;
        if (raytraceTarget) {
          const isvisible = isObjectVisible(group.current, camera, raycaster, raytraceTarget);
          visible.current = isvisible && !isBehindCamera;
        } else {
          visible.current = !isBehindCamera;
        }
        if (previouslyVisible !== visible.current) {
          if (onOcclude) onOcclude(!visible.current);
          else el.style.display = visible.current ? "block" : "none";
        }
        const halfRange = Math.floor(zIndexRange[0] / 2);
        const zRange = occlude ? isRayCastOcclusion ? [zIndexRange[0], halfRange] : [halfRange - 1, 0] : zIndexRange;
        el.style.zIndex = `${objectZIndex(group.current, camera, zRange)}`;
        if (transform) {
          const [widthHalf, heightHalf] = [size.width / 2, size.height / 2];
          const fov = camera.projectionMatrix.elements[5] * heightHalf;
          const {
            isOrthographicCamera,
            top,
            left,
            bottom,
            right
          } = camera;
          const cameraMatrix = getCameraCSSMatrix(camera.matrixWorldInverse);
          const cameraTransform = isOrthographicCamera ? `scale(${fov})translate(${epsilon(-(right + left) / 2)}px,${epsilon((top + bottom) / 2)}px)` : `translateZ(${fov}px)`;
          let matrix = group.current.matrixWorld;
          if (sprite) {
            matrix = camera.matrixWorldInverse.clone().transpose().copyPosition(matrix).scale(group.current.scale);
            matrix.elements[3] = matrix.elements[7] = matrix.elements[11] = 0;
            matrix.elements[15] = 1;
          }
          el.style.width = size.width + "px";
          el.style.height = size.height + "px";
          el.style.perspective = isOrthographicCamera ? "" : `${fov}px`;
          if (transformOuterRef.current && transformInnerRef.current) {
            transformOuterRef.current.style.transform = `${cameraTransform}${cameraMatrix}translate(${widthHalf}px,${heightHalf}px)`;
            transformInnerRef.current.style.transform = getObjectCSSMatrix(matrix, 1 / ((distanceFactor || 10) / 400));
          }
        } else {
          const scale = distanceFactor === void 0 ? 1 : objectScale(group.current, camera) * distanceFactor;
          el.style.transform = `translate3d(${vec[0]}px,${vec[1]}px,0) scale(${scale})`;
        }
        oldPosition.current = vec;
        oldZoom.current = camera.zoom;
      }
    }
    if (!isRayCastOcclusion && occlusionMeshRef.current && !isMeshSizeSet.current) {
      if (transform) {
        if (transformOuterRef.current) {
          const el2 = transformOuterRef.current.children[0];
          if (el2 != null && el2.clientWidth && el2 != null && el2.clientHeight) {
            const {
              isOrthographicCamera
            } = camera;
            if (isOrthographicCamera || geometry) {
              if (props.scale) {
                if (!Array.isArray(props.scale)) {
                  occlusionMeshRef.current.scale.setScalar(1 / props.scale);
                } else if (props.scale instanceof Vector3) {
                  occlusionMeshRef.current.scale.copy(props.scale.clone().divideScalar(1));
                } else {
                  occlusionMeshRef.current.scale.set(1 / props.scale[0], 1 / props.scale[1], 1 / props.scale[2]);
                }
              }
            } else {
              const ratio = (distanceFactor || 10) / 400;
              const w = el2.clientWidth * ratio;
              const h = el2.clientHeight * ratio;
              occlusionMeshRef.current.scale.set(w, h, 1);
            }
            isMeshSizeSet.current = true;
          }
        }
      } else {
        const ele = el.children[0];
        if (ele != null && ele.clientWidth && ele != null && ele.clientHeight) {
          const ratio = 1 / viewport.factor;
          const w = ele.clientWidth * ratio;
          const h = ele.clientHeight * ratio;
          occlusionMeshRef.current.scale.set(w, h, 1);
          isMeshSizeSet.current = true;
        }
        occlusionMeshRef.current.lookAt(gl2.camera.position);
      }
    }
  });
  const shaders = reactExports.useMemo(() => ({
    vertexShader: !transform ? (
      /* glsl */
      `
          /*
            This shader is from the THREE's SpriteMaterial.
            We need to turn the backing plane into a Sprite
            (make it always face the camera) if "transfrom"
            is false.
          */
          #include <common>

          void main() {
            vec2 center = vec2(0., 1.);
            float rotation = 0.0;

            // This is somewhat arbitrary, but it seems to work well
            // Need to figure out how to derive this dynamically if it even matters
            float size = 0.03;

            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
            vec2 scale;
            scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
            scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

            bool isPerspective = isPerspectiveMatrix( projectionMatrix );
            if ( isPerspective ) scale *= - mvPosition.z;

            vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;
            vec2 rotatedPosition;
            rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
            rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;

            gl_Position = projectionMatrix * mvPosition;
          }
      `
    ) : void 0,
    fragmentShader: (
      /* glsl */
      `
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `
    )
  }), [transform]);
  return /* @__PURE__ */ reactExports.createElement("group", _extends({}, props, {
    ref: group
  }), occlude && !isRayCastOcclusion && /* @__PURE__ */ reactExports.createElement("mesh", {
    castShadow,
    receiveShadow,
    ref: occlusionMeshRef
  }, geometry || /* @__PURE__ */ reactExports.createElement("planeGeometry", null), material || /* @__PURE__ */ reactExports.createElement("shaderMaterial", {
    side: DoubleSide,
    vertexShader: shaders.vertexShader,
    fragmentShader: shaders.fragmentShader
  })));
});
function initMetaAwarenessState() {
  return {
    selfCoherence: 0.5,
    selfBoundaryClarity: 0.5,
    bodyOwnershipIndex: 0.5,
    worldModelConfidence: 0.5,
    selfWorldContrastIndex: 0.5,
    agencyEstimate: 0.5,
    metaAwarenessLevel: 0.5,
    attentionToSelf: 0.5,
    attentionToWorld: 0.5,
    temporalContinuityScore: 0.5,
    memoryCoherenceIndex: 0.5,
    identityStabilityIndex: 0.5,
    accessGateThreshold: 0.55,
    gatePressure: 0.3,
    gatedItems: 2,
    feltUrgency: 0.3,
    feltConfidence: 0.5,
    feltValence: 0,
    feltArousability: 0.5,
    arbitrationBias: 0,
    confidenceModulator: 1,
    actionCommitmentScale: 1
  };
}
function ema(prev, next, alpha) {
  return prev * (1 - alpha) + next * alpha;
}
function clamp(v, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, v));
}
class MetaAwarenessEngine {
  constructor() {
    __publicField(this, "state", initMetaAwarenessState());
  }
  getState() {
    return { ...this.state };
  }
  update(inputs) {
    const prev = this.state;
    const {
      pfcActivation,
      amygdalaActivation,
      hippocampusActivation,
      insulaActivation,
      accActivation,
      nacActivation,
      globalArousal,
      predictionError,
      sympatheticTone,
      fatigue,
      episodicMemoryStrength,
      failureMemoryStrength
    } = inputs;
    const selfCoherence = clamp(
      ema(
        prev.selfCoherence,
        pfcActivation * 0.6 + (1 - accActivation * 0.4),
        0.1
      )
    );
    const bodyOwnershipIndex = clamp(
      ema(
        prev.bodyOwnershipIndex,
        insulaActivation * 0.6 + (1 - fatigue) * 0.4,
        0.1
      )
    );
    const selfBoundaryClarity = clamp(
      ema(
        prev.selfBoundaryClarity,
        (selfCoherence + bodyOwnershipIndex) * 0.5,
        0.08
      )
    );
    const worldModelConfidence = clamp(
      ema(
        prev.worldModelConfidence,
        hippocampusActivation * 0.5 + (1 - predictionError) * 0.5,
        0.08
      )
    );
    const agencyEstimate = clamp(
      ema(
        prev.agencyEstimate,
        (1 - predictionError) * 0.5 + pfcActivation * 0.3 + (1 - fatigue) * 0.2,
        0.1
      )
    );
    const selfWorldContrastIndex = clamp(
      Math.abs(selfCoherence - worldModelConfidence)
    );
    const ansBalance = 1 - Math.abs(sympatheticTone - 0.5) * 2;
    const metaAwarenessLevel = clamp(
      selfCoherence * 0.4 + worldModelConfidence * 0.3 + ansBalance * 0.3
    );
    const attentionToSelf = clamp(
      insulaActivation * 0.5 + accActivation * 0.3 + (1 - globalArousal) * 0.2
    );
    const attentionToWorld = clamp(1 - attentionToSelf + globalArousal * 0.2);
    const temporalContinuityScore = clamp(
      ema(
        prev.temporalContinuityScore,
        (selfCoherence + episodicMemoryStrength) / 2,
        0.05
      )
    );
    const memoryCoherenceIndex = clamp(
      ema(
        prev.memoryCoherenceIndex,
        episodicMemoryStrength * 0.7 + (1 - failureMemoryStrength) * 0.3,
        0.07
      )
    );
    const identityStabilityIndex = clamp(
      temporalContinuityScore * selfCoherence
    );
    const accessGateThreshold = clamp(0.3 + metaAwarenessLevel * 0.5, 0.3, 0.8);
    const gatePressure = clamp(
      amygdalaActivation * 0.35 + accActivation * 0.25 + predictionError * 0.25 + globalArousal * 0.15
    );
    const gatedItems = Math.round(
      Math.max(0, (gatePressure - accessGateThreshold + 0.4) * 10)
    );
    const feltUrgency = clamp(
      amygdalaActivation * 0.5 + sympatheticTone * 0.3 + accActivation * 0.2
    );
    const feltConfidence = clamp(
      pfcActivation * 0.5 + (1 - predictionError) * 0.3 + worldModelConfidence * 0.2
    );
    const feltValence = clamp(
      (nacActivation - amygdalaActivation) * 0.7 + (1 - fatigue) * 0.3,
      -1,
      1
    );
    const feltArousability = clamp(
      globalArousal * 0.5 + sympatheticTone * 0.3 + feltUrgency * 0.2
    );
    const arbitrationBias = clamp(
      feltValence * 0.4 + (worldModelConfidence - 0.5) * 0.6,
      -1,
      1
    );
    const confidenceModulator = clamp(0.5 + feltConfidence, 0.5, 1.5);
    const actionCommitmentScale = clamp(
      0.5 + temporalContinuityScore * identityStabilityIndex,
      0.5,
      1.5
    );
    this.state = {
      selfCoherence,
      selfBoundaryClarity,
      bodyOwnershipIndex,
      worldModelConfidence,
      selfWorldContrastIndex,
      agencyEstimate,
      metaAwarenessLevel,
      attentionToSelf,
      attentionToWorld,
      temporalContinuityScore,
      memoryCoherenceIndex,
      identityStabilityIndex,
      accessGateThreshold,
      gatePressure,
      gatedItems,
      feltUrgency,
      feltConfidence,
      feltValence,
      feltArousability,
      arbitrationBias,
      confidenceModulator,
      actionCommitmentScale
    };
    return { ...this.state };
  }
  reset() {
    this.state = initMetaAwarenessState();
  }
}
const globalMetaAwareness = new MetaAwarenessEngine();
const NODE_DEFS = [
  // Delta (benchmark)
  {
    name: "DELTA THEATER CMD",
    layer: "theater",
    faction: "delta",
    pos: [0, 8, 0],
    objectives: ["Maintain strategic balance", "Monitor all sectors"]
  },
  {
    name: "DELTA OPS NORTH",
    layer: "operational",
    faction: "delta",
    pos: [-30, 4, -30],
    objectives: ["Secure northern corridor", "Establish supply line"]
  },
  {
    name: "DELTA REGIONAL EAST",
    layer: "regional",
    faction: "delta",
    pos: [40, 2, 20],
    objectives: ["Hold eastern perimeter", "Coordinate recon"]
  },
  // Alpha
  {
    name: "ALPHA THEATER CMD",
    layer: "theater",
    faction: "alpha",
    pos: [-50, 8, -50],
    objectives: ["Advance on delta positions", "Disrupt supply"]
  },
  {
    name: "ALPHA OPS WEST",
    layer: "operational",
    faction: "alpha",
    pos: [-70, 4, 10],
    objectives: ["Flank from west", "Secure fuel depot"]
  },
  {
    name: "ALPHA REGIONAL SOUTH",
    layer: "regional",
    faction: "alpha",
    pos: [-30, 2, 60],
    objectives: ["Hold southern flank", "Maintain comms"]
  },
  // Omega
  {
    name: "OMEGA THEATER CMD",
    layer: "theater",
    faction: "omega",
    pos: [50, 8, 50],
    objectives: ["Counter-advance", "Protect strategic assets"]
  },
  {
    name: "OMEGA OPS EAST",
    layer: "operational",
    faction: "omega",
    pos: [70, 4, -20],
    objectives: ["Eastern pincer", "Cut supply lines"]
  },
  {
    name: "OMEGA REGIONAL NORTH",
    layer: "regional",
    faction: "omega",
    pos: [20, 2, -70],
    objectives: ["Northern defense", "Intercept scouts"]
  }
];
class WarCommandOpsRuntime {
  constructor() {
    __publicField(this, "state", null);
    __publicField(this, "initialized", false);
  }
  init() {
    if (this.initialized) return;
    this.initialized = true;
    const nodes = NODE_DEFS.map((def) => ({
      id: def.name.toLowerCase().replace(/\s+/g, "_"),
      instanceId: `warcommand_${def.name.toLowerCase().replace(/\s+/g, "_")}`,
      name: def.name,
      layer: def.layer,
      faction: def.faction,
      position: def.pos,
      objectives: def.objectives,
      burdenLevel: 0.2 + Math.random() * 0.3,
      uncertaintyLevel: 0.2 + Math.random() * 0.3,
      supplyStatus: 0.6 + Math.random() * 0.3,
      morale: 0.5 + Math.random() * 0.4,
      lastActionType: "EXPLORE",
      lastConfidence: 0.5,
      metaAwarenessScore: 0.5,
      tick: 0,
      cumulativeScore: 0
    }));
    if (!liveBrainBus.isActive) liveBrainBus.start();
    this.state = {
      tick: 0,
      sessionId: `theater_session_${Date.now()}`,
      nodes,
      deltaScore: 0,
      alphaScore: 0,
      omegaScore: 0,
      strategicPressure: 0.3,
      logisticsHealth: 0.7,
      sensingUncertainty: 0.4,
      traceLog: []
    };
  }
  tick(_deltaMs) {
    if (!this.state) return this._emptyState();
    const s = this.state;
    s.tick++;
    const newTraces = [];
    for (const node of s.nodes) {
      node.burdenLevel = Math.min(
        1,
        node.burdenLevel * 0.95 + s.strategicPressure * 0.08 + Math.random() * 0.02
      );
      node.uncertaintyLevel = Math.min(
        1,
        node.uncertaintyLevel * 0.92 + s.sensingUncertainty * 0.1 + Math.random() * 0.03
      );
      const packet = liveBrainBus.routePayload(`warcommand_${node.id}`, {
        threat_level: node.burdenLevel * 0.8 + node.uncertaintyLevel * 0.2,
        reward_level: node.supplyStatus * 0.6 + node.morale * 0.4,
        novelty: node.uncertaintyLevel * 0.5,
        urgency: node.burdenLevel * 0.9,
        salience: (node.burdenLevel + node.uncertaintyLevel) * 0.5
      });
      node.lastActionType = packet.action_type;
      node.lastConfidence = packet.confidence;
      node.tick = s.tick;
      const maState = globalMetaAwareness.update({
        pfcActivation: packet.confidence,
        amygdalaActivation: node.burdenLevel,
        hippocampusActivation: 1 - node.uncertaintyLevel,
        insulaActivation: node.burdenLevel * 0.6,
        accActivation: node.uncertaintyLevel,
        nacActivation: node.morale,
        globalArousal: (node.burdenLevel + node.uncertaintyLevel) * 0.5,
        predictionError: node.uncertaintyLevel,
        sympatheticTone: node.burdenLevel,
        fatigue: 1 - node.supplyStatus,
        stress: node.burdenLevel,
        episodicMemoryStrength: node.morale,
        failureMemoryStrength: 1 - node.morale,
        tick: s.tick
      });
      node.metaAwarenessScore = maState.metaAwarenessLevel;
      switch (packet.action_type) {
        case "MOVE":
          node.morale = Math.min(1, node.morale + 0.01);
          node.burdenLevel = Math.max(0, node.burdenLevel - 5e-3);
          break;
        case "RETREAT":
        case "FREEZE":
          node.uncertaintyLevel = Math.min(1, node.uncertaintyLevel + 0.01);
          break;
        case "ESCALATE":
          node.burdenLevel = Math.min(1, node.burdenLevel + 0.02);
          node.supplyStatus = Math.max(0, node.supplyStatus - 5e-3);
          break;
        case "INVESTIGATE":
          node.uncertaintyLevel = Math.max(0, node.uncertaintyLevel - 0.01);
          break;
        default:
          node.supplyStatus = Math.min(1, node.supplyStatus + 3e-3);
      }
      const tickScore = packet.confidence * node.morale * (1 - node.burdenLevel * 0.5);
      node.cumulativeScore += tickScore;
      const outcome = packet.action_type === "MOVE" || packet.action_type === "INVESTIGATE" ? Math.random() < packet.confidence ? "success" : "neutral" : packet.action_type === "RETREAT" || packet.action_type === "FREEZE" ? "neutral" : "failure";
      newTraces.push({
        tick: s.tick,
        nodeId: node.id,
        layer: node.layer,
        faction: node.faction,
        actionType: packet.action_type,
        confidence: packet.confidence,
        metaAwarenessScore: node.metaAwarenessScore,
        outcome
      });
    }
    const allBurden = s.nodes.reduce((a, n) => a + n.burdenLevel, 0) / s.nodes.length;
    s.strategicPressure = Math.min(1, allBurden * 1.2);
    const allSupply = s.nodes.reduce((a, n) => a + n.supplyStatus, 0) / s.nodes.length;
    s.logisticsHealth = allSupply;
    const allUncertainty = s.nodes.reduce((a, n) => a + n.uncertaintyLevel, 0) / s.nodes.length;
    s.sensingUncertainty = allUncertainty;
    s.deltaScore = s.nodes.filter((n) => n.faction === "delta").reduce((a, n) => a + n.cumulativeScore, 0);
    s.alphaScore = s.nodes.filter((n) => n.faction === "alpha").reduce((a, n) => a + n.cumulativeScore, 0);
    s.omegaScore = s.nodes.filter((n) => n.faction === "omega").reduce((a, n) => a + n.cumulativeScore, 0);
    s.traceLog = [...newTraces, ...s.traceLog].slice(0, 60);
    return { ...s, nodes: s.nodes.map((n) => ({ ...n })) };
  }
  getLeaderboard() {
    if (!this.state) return { delta: 0, alpha: 0, omega: 0 };
    return {
      delta: this.state.deltaScore,
      alpha: this.state.alphaScore,
      omega: this.state.omegaScore
    };
  }
  getState() {
    return this.state;
  }
  isInitialized() {
    return this.initialized;
  }
  _emptyState() {
    return {
      tick: 0,
      sessionId: "none",
      nodes: [],
      deltaScore: 0,
      alphaScore: 0,
      omegaScore: 0,
      strategicPressure: 0,
      logisticsHealth: 1,
      sensingUncertainty: 0,
      traceLog: []
    };
  }
}
const globalWarCommandOpsRuntime = new WarCommandOpsRuntime();
const FACTION_COLORS = {
  delta: "#f59e0b",
  alpha: "#3b82f6",
  omega: "#ef4444"
};
const LAYER_RADIUS = {
  theater: 3.5,
  operational: 2.5,
  regional: 1.8
};
function pct(v) {
  return `${(v * 100).toFixed(0)}%`;
}
const BAR = (val, color) => ({
  width: `${(val * 100).toFixed(0)}%`,
  height: 5,
  background: color,
  borderRadius: 1,
  transition: "width 0.3s ease"
});
function TheaterGround() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { rotation: [-Math.PI / 2, 0, 0], receiveShadow: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("planeGeometry", { args: [300, 300, 40, 40] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meshStandardMaterial", { color: "#0a1a0a", roughness: 0.95 })
    ] }),
    Array.from({ length: 13 }, (_, i) => i * 25 - 150).map((x) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "mesh",
      {
        position: [x, 0.01, 0],
        rotation: [-Math.PI / 2, 0, 0],
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("planeGeometry", { args: [0.15, 300] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("meshStandardMaterial", { color: "#1a2a1a", transparent: true, opacity: 0.5 })
        ]
      },
      `gx-${x}`
    )),
    Array.from({ length: 13 }, (_, i) => i * 25 - 150).map((z) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "mesh",
      {
        position: [0, 0.01, z],
        rotation: [-Math.PI / 2, 0, 0],
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("planeGeometry", { args: [300, 0.15] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("meshStandardMaterial", { color: "#1a2a1a", transparent: true, opacity: 0.5 })
        ]
      },
      `gz-${z}`
    ))
  ] });
}
function SupplyDepots() {
  const depots = reactExports.useMemo(
    () => [
      { x: -60, z: 0 },
      { x: 30, z: -80 },
      { x: 20, z: 80 }
    ],
    []
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: depots.map((d, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: static useMemo array
    /* @__PURE__ */ jsxRuntimeExports.jsxs("group", { position: [d.x, 0, d.z], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [0, 2, 0], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("boxGeometry", { args: [6, 4, 6] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "meshStandardMaterial",
          {
            color: "#1a3a1a",
            emissive: "#15803d",
            emissiveIntensity: 0.3
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "pointLight",
        {
          color: "#22c55e",
          intensity: 1.5,
          distance: 15,
          position: [0, 5, 0]
        }
      )
    ] }, i)
  )) });
}
function ContestedZones() {
  const zones = reactExports.useMemo(
    () => [
      { x: -10, z: -30 },
      { x: 15, z: 40 }
    ],
    []
  );
  const [pulse, setPulse] = reactExports.useState(0);
  useFrame((_, dt) => setPulse((p) => p + dt * 2));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: zones.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "mesh",
    {
      position: [z.x, 0.1, z.z],
      rotation: [-Math.PI / 2, 0, 0],
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [4 + Math.sin(pulse) * 0.5, 16, 16] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "meshStandardMaterial",
          {
            color: "#eab308",
            emissive: "#ca8a04",
            emissiveIntensity: 0.5 + Math.sin(pulse) * 0.3,
            transparent: true,
            opacity: 0.35
          }
        )
      ]
    },
    `zone-${z.x.toFixed(0)}-${z.z.toFixed(0)}`
  )) });
}
function ConnectionLines({ nodes }) {
  const lines = reactExports.useMemo(() => {
    const pairs = [];
    const theaters = nodes.filter((n) => n.layer === "theater");
    const ops = nodes.filter((n) => n.layer === "operational");
    const regionals = nodes.filter((n) => n.layer === "regional");
    for (const t of theaters) {
      for (const o of ops) {
        if (o.faction === t.faction) pairs.push([t, o]);
      }
    }
    for (const o of ops) {
      for (const r of regionals) {
        if (r.faction === o.faction) pairs.push([o, r]);
      }
    }
    return pairs;
  }, [nodes]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: lines.map(([a, b], i) => {
    const start = new Vector3(...a.position);
    const end = new Vector3(...b.position);
    const dir = end.clone().sub(start);
    const mid = start.clone().add(dir.clone().multiplyScalar(0.5));
    const len = dir.length();
    const up = new Vector3(0, 1, 0);
    const quat = new Quaternion().setFromUnitVectors(
      up,
      dir.clone().normalize()
    );
    const color = FACTION_COLORS[a.faction] ?? "#ffffff";
    return (
      // biome-ignore lint/suspicious/noArrayIndexKey: stable computed pairs
      /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: mid, quaternion: quat, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("cylinderGeometry", { args: [0.12, 0.12, len, 6] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "meshStandardMaterial",
          {
            color,
            emissive: color,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.6
          }
        )
      ] }, i)
    );
  }) });
}
function CommandNodeMesh({
  node,
  selected,
  onClick
}) {
  const groupRef = reactExports.useRef(null);
  const [t, setT] = reactExports.useState(0);
  useFrame((_, dt) => setT((prev) => prev + dt));
  const r = LAYER_RADIUS[node.layer] ?? 2;
  const h = node.layer === "theater" ? 6 : node.layer === "operational" ? 4 : 2.5;
  const color = FACTION_COLORS[node.faction] ?? "#ffffff";
  const scale = 1 + Math.sin(t * 1.5) * 0.04;
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Three.js canvas element
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "group",
      {
        ref: groupRef,
        position: node.position,
        scale: [scale, 1, scale],
        onClick: (e) => {
          e.stopPropagation();
          onClick();
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [0, h / 2, 0], castShadow: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("cylinderGeometry", { args: [r, r * 1.1, h, 6] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "meshStandardMaterial",
              {
                color,
                emissive: color,
                emissiveIntensity: selected ? 0.8 : 0.25 + node.metaAwarenessScore * 0.3,
                metalness: 0.3,
                roughness: 0.6
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [0, 0.08, 0], rotation: [-Math.PI / 2, 0, 0], children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("ringGeometry", { args: [r * 1.1, r * 1.5, 32] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "meshStandardMaterial",
              {
                color,
                emissive: color,
                emissiveIntensity: 0.5 + Math.sin(t) * 0.2,
                transparent: true,
                opacity: 0.7
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "pointLight",
            {
              color,
              intensity: 2 + node.burdenLevel,
              distance: 20,
              position: [0, h, 0]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Html,
            {
              position: [0, h + 2.5, 0],
              center: true,
              style: { pointerEvents: "none", userSelect: "none" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 10,
                    color,
                    letterSpacing: 1,
                    whiteSpace: "nowrap",
                    textShadow: `0 0 8px ${color}`,
                    background: "rgba(0,0,0,0.5)",
                    padding: "2px 6px"
                  },
                  children: node.name.split(" ").slice(0, 2).join(" ")
                }
              )
            }
          ),
          selected && /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { position: [0, 0.12, 0], rotation: [-Math.PI / 2, 0, 0], children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("ringGeometry", { args: [r * 1.6, r * 2, 32] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "meshStandardMaterial",
              {
                color: "#f59e0b",
                emissive: "#f59e0b",
                emissiveIntensity: 1.5
              }
            )
          ] })
        ]
      }
    )
  );
}
function TheaterScene({
  theaterState,
  selectedId,
  onSelectNode
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("color", { attach: "background", args: ["#04080d"] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("fog", { attach: "fog", args: ["#0d1117", 45, 220] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ambientLight", { intensity: 0.15, color: "#2a3040" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "directionalLight",
      {
        position: [50, 80, 30],
        intensity: 0.8,
        color: "#c8a860",
        castShadow: true,
        "shadow-mapSize": [1024, 1024]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "directionalLight",
      {
        position: [-30, 30, -40],
        intensity: 0.3,
        color: "#405060"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TheaterGround, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyDepots, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ContestedZones, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectionLines, { nodes: theaterState.nodes }),
    theaterState.nodes.map((node) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      CommandNodeMesh,
      {
        node,
        selected: selectedId === node.id,
        onClick: () => onSelectNode(selectedId === node.id ? null : node.id)
      },
      node.id
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      OrbitControls,
      {
        enablePan: true,
        enableZoom: true,
        enableRotate: true,
        minPolarAngle: 0.1,
        maxPolarAngle: Math.PI / 2.3,
        minDistance: 10,
        maxDistance: 200
      }
    )
  ] });
}
function NodePanel({
  node,
  traces,
  onClose
}) {
  const recent = traces.filter((t) => t.nodeId === node.id).slice(0, 3);
  const factionColor = FACTION_COLORS[node.faction] ?? "#ffffff";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "warcommandops.node_panel",
      style: {
        position: "absolute",
        top: 16,
        right: 16,
        width: 296,
        background: "rgba(4,8,13,0.93)",
        border: `1px solid ${factionColor}22`,
        borderLeft: `3px solid ${factionColor}`,
        padding: "14px",
        fontFamily: "monospace",
        fontSize: 11,
        color: "#c8c0a8",
        backdropFilter: "blur(8px)",
        zIndex: 20
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      color: factionColor,
                      fontSize: 12,
                      fontWeight: "bold",
                      letterSpacing: 1
                    },
                    children: node.name
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#64748b", fontSize: 9 }, children: [
                  node.layer.toUpperCase(),
                  " · ",
                  node.faction.toUpperCase()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  style: {
                    background: "transparent",
                    border: "1px solid #374151",
                    color: "#94a3b8",
                    padding: "2px 8px",
                    cursor: "pointer",
                    fontSize: 10
                  },
                  children: "CLOSE"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              marginBottom: 10,
              padding: "6px 8px",
              background: "rgba(245,158,11,0.07)",
              border: "1px solid #92400e33"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    color: "#92400e",
                    fontSize: 9,
                    letterSpacing: 1,
                    marginBottom: 4
                  },
                  children: "META-AWARENESS"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#1e293b", borderRadius: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: BAR(node.metaAwarenessScore, factionColor) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: factionColor, fontSize: 10, marginTop: 3 }, children: pct(node.metaAwarenessScore) })
            ]
          }
        ),
        [
          { label: "BURDEN", val: node.burdenLevel, color: "#ef4444" },
          { label: "UNCERTAINTY", val: node.uncertaintyLevel, color: "#f59e0b" },
          { label: "SUPPLY", val: node.supplyStatus, color: "#22c55e" },
          { label: "MORALE", val: node.morale, color: "#3b82f6" }
        ].map(({ label, val, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 2
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#64748b", fontSize: 9 }, children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color }, children: pct(val) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#1e293b", borderRadius: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: BAR(val, color) }) })
        ] }, label)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              marginBottom: 10,
              padding: "6px 8px",
              background: "#0a0f18",
              border: "1px solid #1e293b"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    color: "#64748b",
                    fontSize: 9,
                    letterSpacing: 1,
                    marginBottom: 4
                  },
                  children: "LAST BRAIN ACTION"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: factionColor, fontSize: 12, fontWeight: "bold" }, children: node.lastActionType }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 4, background: "#1e293b", borderRadius: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: BAR(node.lastConfidence, "#3b82f6") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#64748b", fontSize: 9, marginTop: 2 }, children: [
                "CONFIDENCE ",
                pct(node.lastConfidence)
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                color: "#64748b",
                fontSize: 9,
                letterSpacing: 1,
                marginBottom: 6
              },
              children: "OBJECTIVES"
            }
          ),
          node.objectives.map((obj) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: { fontSize: 9, color: "#94a3b8", marginBottom: 3 },
              children: [
                "◦ ",
                obj
              ]
            },
            obj
          ))
        ] }),
        recent.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { borderTop: "1px solid #1e293b", paddingTop: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                color: "#64748b",
                fontSize: 9,
                letterSpacing: 1,
                marginBottom: 6
              },
              children: "RECENT TRACES"
            }
          ),
          recent.map((t, _i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 3,
                fontSize: 9,
                color: t.outcome === "success" ? "#22c55e" : t.outcome === "failure" ? "#ef4444" : "#94a3b8"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "T",
                  t.tick,
                  " ",
                  t.actionType
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "MA:",
                  (t.metaAwarenessScore * 100).toFixed(0),
                  "%",
                  " ",
                  t.outcome.toUpperCase()
                ] })
              ]
            },
            t.nodeId + String(t.tick) + t.actionType
          ))
        ] })
      ]
    }
  );
}
function BenchmarkPanel({ state }) {
  const maxScore = Math.max(
    state.deltaScore,
    state.alphaScore,
    state.omegaScore,
    1
  );
  const entries = [
    { label: "DELTA", score: state.deltaScore, color: "#f59e0b" },
    { label: "ALPHA", score: state.alphaScore, color: "#3b82f6" },
    { label: "OMEGA", score: state.omegaScore, color: "#ef4444" }
  ];
  const leader = entries.reduce(
    (a, b) => b.score > a.score ? b : a,
    entries[0]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "warcommandops.benchmark_panel",
      style: {
        position: "absolute",
        bottom: 48,
        left: 16,
        width: 220,
        background: "rgba(4,8,13,0.88)",
        border: "1px solid #92400e33",
        padding: "12px",
        fontFamily: "monospace",
        fontSize: 10,
        backdropFilter: "blur(6px)",
        zIndex: 10
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              color: "#92400e",
              fontSize: 9,
              letterSpacing: 1,
              marginBottom: 10
            },
            children: "BENCHMARK COMPARISON"
          }
        ),
        entries.map(({ label, score, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 3
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    style: {
                      color: label === leader.label ? color : "#64748b",
                      fontWeight: label === leader.label ? "bold" : "normal"
                    },
                    children: [
                      label,
                      " ",
                      label === leader.label ? "LEADING" : ""
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color }, children: score.toFixed(1) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "#1e293b", borderRadius: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                width: `${(score / maxScore * 100).toFixed(0)}%`,
                height: 6,
                background: color,
                borderRadius: 1,
                transition: "width 0.5s ease"
              }
            }
          ) })
        ] }, label))
      ]
    }
  );
}
function TheaterStatusBar({ state }) {
  const bus = liveBrainBus.getBusStatus();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(4,8,13,0.92)",
        borderTop: "1px solid #92400e33",
        padding: "6px 16px",
        display: "flex",
        gap: 24,
        alignItems: "center",
        fontFamily: "monospace",
        fontSize: 10,
        color: "#64748b",
        backdropFilter: "blur(4px)",
        zIndex: 10,
        flexWrap: "wrap"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#f59e0b" }, children: "WARCOMMANDOPS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "TICK ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#94a3b8" }, children: state.tick })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "PRESSURE",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                color: state.strategicPressure > 0.6 ? "#ef4444" : "#f59e0b"
              },
              children: pct(state.strategicPressure)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "LOGISTICS",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: { color: state.logisticsHealth > 0.5 ? "#22c55e" : "#f59e0b" },
              children: pct(state.logisticsHealth)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "UNCERTAINTY",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#94a3b8" }, children: pct(state.sensingUncertainty) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: bus.isActive ? "#22c55e" : "#475569" }, children: [
          "BRAIN BUS ",
          bus.isActive ? "LIVE" : "OFF"
        ] })
      ]
    }
  );
}
function WarCommandOpsStartMenu({ onEnter }) {
  const bus = liveBrainBus.getBusStatus();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        height: "100%",
        background: "#04080d",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
        position: "relative",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(circle, rgba(245,158,11,0.06) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              pointerEvents: "none"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", zIndex: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 9,
                color: "#92400e",
                letterSpacing: 8,
                marginBottom: 12,
                opacity: 0.8
              },
              children: "NEUROEMERGENCE CORE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 36,
                fontWeight: "bold",
                color: "#e2e8f0",
                letterSpacing: 4,
                lineHeight: 1.1
              },
              children: "EMERGENT"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 36,
                fontWeight: "bold",
                color: "#f59e0b",
                letterSpacing: 4,
                marginBottom: 6
              },
              children: "WARCOMMANDOPS"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 10,
                color: "#64748b",
                letterSpacing: 3,
                marginBottom: 40
              },
              children: "STRATEGIC AI · 9 COMMAND NODES · 3-FACTION BENCHMARK"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                gap: 24,
                justifyContent: "center",
                marginBottom: 40,
                padding: "12px 24px",
                background: "rgba(245,158,11,0.05)",
                border: "1px solid #92400e33"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    style: { fontSize: 9, color: bus.isActive ? "#22c55e" : "#475569" },
                    children: [
                      "● CORE ",
                      bus.isActive ? "LIVE" : "OFFLINE"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, color: "#475569" }, children: "9 NODES" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, color: "#475569" }, children: "DELTA · ALPHA · OMEGA" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "warcommandops.observer_button",
              onClick: onEnter,
              style: {
                background: "transparent",
                border: "2px solid #f59e0b",
                color: "#f59e0b",
                padding: "14px 48px",
                fontSize: 14,
                letterSpacing: 4,
                cursor: "pointer",
                fontFamily: "monospace",
                transition: "all 0.2s",
                marginBottom: 16,
                display: "block",
                width: "100%"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "rgba(245,158,11,0.15)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "transparent";
              },
              children: "ENTER THEATER"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 9, color: "#374151", letterSpacing: 2 }, children: "THEATER · OPERATIONAL · REGIONAL COMMAND LAYERS" })
        ] })
      ]
    }
  );
}
function TheaterWorld() {
  const [theaterState, setTheaterState] = reactExports.useState(() => {
    if (!globalWarCommandOpsRuntime.isInitialized()) {
      globalWarCommandOpsRuntime.init();
    }
    return globalWarCommandOpsRuntime.getState() ?? {
      tick: 0,
      sessionId: "init",
      nodes: [],
      deltaScore: 0,
      alphaScore: 0,
      omegaScore: 0,
      strategicPressure: 0,
      logisticsHealth: 1,
      sensingUncertainty: 0,
      traceLog: []
    };
  });
  const [selectedId, setSelectedId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      const next = globalWarCommandOpsRuntime.tick(800);
      setTheaterState({ ...next });
    }, 800);
    return () => clearInterval(interval);
  }, []);
  const selectedNode = selectedId ? theaterState.nodes.find((n) => n.id === selectedId) ?? null : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", height: "100%", width: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Canvas,
      {
        camera: { position: [0, 110, 130], fov: 52 },
        shadows: true,
        style: { width: "100%", height: "100%" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TheaterScene,
          {
            theaterState,
            selectedId,
            onSelectNode: setSelectedId
          }
        ) })
      }
    ),
    selectedNode && /* @__PURE__ */ jsxRuntimeExports.jsx(
      NodePanel,
      {
        node: selectedNode,
        traces: theaterState.traceLog,
        onClose: () => setSelectedId(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BenchmarkPanel, { state: theaterState }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TheaterStatusBar, { state: theaterState })
  ] });
}
function WarCommandOpsTab() {
  const [mode, setMode] = reactExports.useState("menu");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { height: "100%", width: "100%", overflow: "hidden" }, children: [
    mode === "menu" && /* @__PURE__ */ jsxRuntimeExports.jsx(WarCommandOpsStartMenu, { onEnter: () => setMode("theater") }),
    mode === "theater" && /* @__PURE__ */ jsxRuntimeExports.jsx(TheaterWorld, {})
  ] });
}
export {
  WarCommandOpsTab as default
};
