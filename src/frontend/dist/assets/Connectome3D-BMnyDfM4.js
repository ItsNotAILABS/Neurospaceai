import { r as reactExports, e as useCanonicalState, i as useEcologyState, n as useSubOrganismState, j as jsxRuntimeExports } from "./index-CGYrnU7d.js";
import { a as useThree, _ as _extends, C as Canvas, O as OrbitControls, u as useFrame } from "./OrbitControls-CwmRBLxw.js";
import { u as REVISION, I as InstancedBufferGeometry, F as Float32BufferAttribute, v as InstancedInterleavedBuffer, w as InterleavedBufferAttribute, x as WireframeGeometry, y as Box3, z as Sphere, V as Vector3, E as ShaderMaterial, G as UniformsUtils, H as UniformsLib, m as Vector2, J as Mesh, K as Vector4, X as Line3, Y as Matrix4, Z as MathUtils, C as Color } from "./three.module-DHVhg58e.js";
const version = /* @__PURE__ */ (() => parseInt(REVISION.replace(/\D+/g, "")))();
const UV1 = version >= 125 ? "uv1" : "uv2";
const _box$1 = /* @__PURE__ */ new Box3();
const _vector = /* @__PURE__ */ new Vector3();
class LineSegmentsGeometry extends InstancedBufferGeometry {
  constructor() {
    super();
    this.isLineSegmentsGeometry = true;
    this.type = "LineSegmentsGeometry";
    const positions = [-1, 2, 0, 1, 2, 0, -1, 1, 0, 1, 1, 0, -1, 0, 0, 1, 0, 0, -1, -1, 0, 1, -1, 0];
    const uvs = [-1, 2, 1, 2, -1, 1, 1, 1, -1, -1, 1, -1, -1, -2, 1, -2];
    const index = [0, 2, 1, 2, 3, 1, 2, 4, 3, 4, 5, 3, 4, 6, 5, 6, 7, 5];
    this.setIndex(index);
    this.setAttribute("position", new Float32BufferAttribute(positions, 3));
    this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  }
  applyMatrix4(matrix) {
    const start = this.attributes.instanceStart;
    const end = this.attributes.instanceEnd;
    if (start !== void 0) {
      start.applyMatrix4(matrix);
      end.applyMatrix4(matrix);
      start.needsUpdate = true;
    }
    if (this.boundingBox !== null) {
      this.computeBoundingBox();
    }
    if (this.boundingSphere !== null) {
      this.computeBoundingSphere();
    }
    return this;
  }
  setPositions(array) {
    let lineSegments;
    if (array instanceof Float32Array) {
      lineSegments = array;
    } else if (Array.isArray(array)) {
      lineSegments = new Float32Array(array);
    }
    const instanceBuffer = new InstancedInterleavedBuffer(lineSegments, 6, 1);
    this.setAttribute("instanceStart", new InterleavedBufferAttribute(instanceBuffer, 3, 0));
    this.setAttribute("instanceEnd", new InterleavedBufferAttribute(instanceBuffer, 3, 3));
    this.computeBoundingBox();
    this.computeBoundingSphere();
    return this;
  }
  setColors(array, itemSize = 3) {
    let colors;
    if (array instanceof Float32Array) {
      colors = array;
    } else if (Array.isArray(array)) {
      colors = new Float32Array(array);
    }
    const instanceColorBuffer = new InstancedInterleavedBuffer(colors, itemSize * 2, 1);
    this.setAttribute("instanceColorStart", new InterleavedBufferAttribute(instanceColorBuffer, itemSize, 0));
    this.setAttribute("instanceColorEnd", new InterleavedBufferAttribute(instanceColorBuffer, itemSize, itemSize));
    return this;
  }
  fromWireframeGeometry(geometry) {
    this.setPositions(geometry.attributes.position.array);
    return this;
  }
  fromEdgesGeometry(geometry) {
    this.setPositions(geometry.attributes.position.array);
    return this;
  }
  fromMesh(mesh) {
    this.fromWireframeGeometry(new WireframeGeometry(mesh.geometry));
    return this;
  }
  fromLineSegments(lineSegments) {
    const geometry = lineSegments.geometry;
    this.setPositions(geometry.attributes.position.array);
    return this;
  }
  computeBoundingBox() {
    if (this.boundingBox === null) {
      this.boundingBox = new Box3();
    }
    const start = this.attributes.instanceStart;
    const end = this.attributes.instanceEnd;
    if (start !== void 0 && end !== void 0) {
      this.boundingBox.setFromBufferAttribute(start);
      _box$1.setFromBufferAttribute(end);
      this.boundingBox.union(_box$1);
    }
  }
  computeBoundingSphere() {
    if (this.boundingSphere === null) {
      this.boundingSphere = new Sphere();
    }
    if (this.boundingBox === null) {
      this.computeBoundingBox();
    }
    const start = this.attributes.instanceStart;
    const end = this.attributes.instanceEnd;
    if (start !== void 0 && end !== void 0) {
      const center = this.boundingSphere.center;
      this.boundingBox.getCenter(center);
      let maxRadiusSq = 0;
      for (let i = 0, il = start.count; i < il; i++) {
        _vector.fromBufferAttribute(start, i);
        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
        _vector.fromBufferAttribute(end, i);
        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
      }
      this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
      if (isNaN(this.boundingSphere.radius)) {
        console.error(
          "THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",
          this
        );
      }
    }
  }
  toJSON() {
  }
  applyMatrix(matrix) {
    console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().");
    return this.applyMatrix4(matrix);
  }
}
class LineGeometry extends LineSegmentsGeometry {
  constructor() {
    super();
    this.isLineGeometry = true;
    this.type = "LineGeometry";
  }
  setPositions(array) {
    const length = array.length - 3;
    const points = new Float32Array(2 * length);
    for (let i = 0; i < length; i += 3) {
      points[2 * i] = array[i];
      points[2 * i + 1] = array[i + 1];
      points[2 * i + 2] = array[i + 2];
      points[2 * i + 3] = array[i + 3];
      points[2 * i + 4] = array[i + 4];
      points[2 * i + 5] = array[i + 5];
    }
    super.setPositions(points);
    return this;
  }
  setColors(array, itemSize = 3) {
    const length = array.length - itemSize;
    const colors = new Float32Array(2 * length);
    if (itemSize === 3) {
      for (let i = 0; i < length; i += itemSize) {
        colors[2 * i] = array[i];
        colors[2 * i + 1] = array[i + 1];
        colors[2 * i + 2] = array[i + 2];
        colors[2 * i + 3] = array[i + 3];
        colors[2 * i + 4] = array[i + 4];
        colors[2 * i + 5] = array[i + 5];
      }
    } else {
      for (let i = 0; i < length; i += itemSize) {
        colors[2 * i] = array[i];
        colors[2 * i + 1] = array[i + 1];
        colors[2 * i + 2] = array[i + 2];
        colors[2 * i + 3] = array[i + 3];
        colors[2 * i + 4] = array[i + 4];
        colors[2 * i + 5] = array[i + 5];
        colors[2 * i + 6] = array[i + 6];
        colors[2 * i + 7] = array[i + 7];
      }
    }
    super.setColors(colors, itemSize);
    return this;
  }
  fromLine(line) {
    const geometry = line.geometry;
    this.setPositions(geometry.attributes.position.array);
    return this;
  }
}
class LineMaterial extends ShaderMaterial {
  constructor(parameters) {
    super({
      type: "LineMaterial",
      uniforms: UniformsUtils.clone(
        UniformsUtils.merge([
          UniformsLib.common,
          UniformsLib.fog,
          {
            worldUnits: { value: 1 },
            linewidth: { value: 1 },
            resolution: { value: new Vector2(1, 1) },
            dashOffset: { value: 0 },
            dashScale: { value: 1 },
            dashSize: { value: 1 },
            gapSize: { value: 1 }
            // todo FIX - maybe change to totalSize
          }
        ])
      ),
      vertexShader: (
        /* glsl */
        `
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`
      ),
      fragmentShader: (
        /* glsl */
        `
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${version >= 154 ? "colorspace_fragment" : "encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`
      ),
      clipping: true
      // required for clipping support
    });
    this.isLineMaterial = true;
    this.onBeforeCompile = function() {
      if (this.transparent) {
        this.defines.USE_LINE_COLOR_ALPHA = "1";
      } else {
        delete this.defines.USE_LINE_COLOR_ALPHA;
      }
    };
    Object.defineProperties(this, {
      color: {
        enumerable: true,
        get: function() {
          return this.uniforms.diffuse.value;
        },
        set: function(value) {
          this.uniforms.diffuse.value = value;
        }
      },
      worldUnits: {
        enumerable: true,
        get: function() {
          return "WORLD_UNITS" in this.defines;
        },
        set: function(value) {
          if (value === true) {
            this.defines.WORLD_UNITS = "";
          } else {
            delete this.defines.WORLD_UNITS;
          }
        }
      },
      linewidth: {
        enumerable: true,
        get: function() {
          return this.uniforms.linewidth.value;
        },
        set: function(value) {
          this.uniforms.linewidth.value = value;
        }
      },
      dashed: {
        enumerable: true,
        get: function() {
          return Boolean("USE_DASH" in this.defines);
        },
        set(value) {
          if (Boolean(value) !== Boolean("USE_DASH" in this.defines)) {
            this.needsUpdate = true;
          }
          if (value === true) {
            this.defines.USE_DASH = "";
          } else {
            delete this.defines.USE_DASH;
          }
        }
      },
      dashScale: {
        enumerable: true,
        get: function() {
          return this.uniforms.dashScale.value;
        },
        set: function(value) {
          this.uniforms.dashScale.value = value;
        }
      },
      dashSize: {
        enumerable: true,
        get: function() {
          return this.uniforms.dashSize.value;
        },
        set: function(value) {
          this.uniforms.dashSize.value = value;
        }
      },
      dashOffset: {
        enumerable: true,
        get: function() {
          return this.uniforms.dashOffset.value;
        },
        set: function(value) {
          this.uniforms.dashOffset.value = value;
        }
      },
      gapSize: {
        enumerable: true,
        get: function() {
          return this.uniforms.gapSize.value;
        },
        set: function(value) {
          this.uniforms.gapSize.value = value;
        }
      },
      opacity: {
        enumerable: true,
        get: function() {
          return this.uniforms.opacity.value;
        },
        set: function(value) {
          this.uniforms.opacity.value = value;
        }
      },
      resolution: {
        enumerable: true,
        get: function() {
          return this.uniforms.resolution.value;
        },
        set: function(value) {
          this.uniforms.resolution.value.copy(value);
        }
      },
      alphaToCoverage: {
        enumerable: true,
        get: function() {
          return Boolean("USE_ALPHA_TO_COVERAGE" in this.defines);
        },
        set: function(value) {
          if (Boolean(value) !== Boolean("USE_ALPHA_TO_COVERAGE" in this.defines)) {
            this.needsUpdate = true;
          }
          if (value === true) {
            this.defines.USE_ALPHA_TO_COVERAGE = "";
            this.extensions.derivatives = true;
          } else {
            delete this.defines.USE_ALPHA_TO_COVERAGE;
            this.extensions.derivatives = false;
          }
        }
      }
    });
    this.setValues(parameters);
  }
}
const _viewport = /* @__PURE__ */ new Vector4();
const _start = /* @__PURE__ */ new Vector3();
const _end = /* @__PURE__ */ new Vector3();
const _start4 = /* @__PURE__ */ new Vector4();
const _end4 = /* @__PURE__ */ new Vector4();
const _ssOrigin = /* @__PURE__ */ new Vector4();
const _ssOrigin3 = /* @__PURE__ */ new Vector3();
const _mvMatrix = /* @__PURE__ */ new Matrix4();
const _line = /* @__PURE__ */ new Line3();
const _closestPoint = /* @__PURE__ */ new Vector3();
const _box = /* @__PURE__ */ new Box3();
const _sphere = /* @__PURE__ */ new Sphere();
const _clipToWorldVector = /* @__PURE__ */ new Vector4();
let _ray, _lineWidth;
function getWorldSpaceHalfWidth(camera, distance, resolution) {
  _clipToWorldVector.set(0, 0, -distance, 1).applyMatrix4(camera.projectionMatrix);
  _clipToWorldVector.multiplyScalar(1 / _clipToWorldVector.w);
  _clipToWorldVector.x = _lineWidth / resolution.width;
  _clipToWorldVector.y = _lineWidth / resolution.height;
  _clipToWorldVector.applyMatrix4(camera.projectionMatrixInverse);
  _clipToWorldVector.multiplyScalar(1 / _clipToWorldVector.w);
  return Math.abs(Math.max(_clipToWorldVector.x, _clipToWorldVector.y));
}
function raycastWorldUnits(lineSegments, intersects) {
  const matrixWorld = lineSegments.matrixWorld;
  const geometry = lineSegments.geometry;
  const instanceStart = geometry.attributes.instanceStart;
  const instanceEnd = geometry.attributes.instanceEnd;
  const segmentCount = Math.min(geometry.instanceCount, instanceStart.count);
  for (let i = 0, l = segmentCount; i < l; i++) {
    _line.start.fromBufferAttribute(instanceStart, i);
    _line.end.fromBufferAttribute(instanceEnd, i);
    _line.applyMatrix4(matrixWorld);
    const pointOnLine = new Vector3();
    const point = new Vector3();
    _ray.distanceSqToSegment(_line.start, _line.end, point, pointOnLine);
    const isInside = point.distanceTo(pointOnLine) < _lineWidth * 0.5;
    if (isInside) {
      intersects.push({
        point,
        pointOnLine,
        distance: _ray.origin.distanceTo(point),
        object: lineSegments,
        face: null,
        faceIndex: i,
        uv: null,
        [UV1]: null
      });
    }
  }
}
function raycastScreenSpace(lineSegments, camera, intersects) {
  const projectionMatrix = camera.projectionMatrix;
  const material = lineSegments.material;
  const resolution = material.resolution;
  const matrixWorld = lineSegments.matrixWorld;
  const geometry = lineSegments.geometry;
  const instanceStart = geometry.attributes.instanceStart;
  const instanceEnd = geometry.attributes.instanceEnd;
  const segmentCount = Math.min(geometry.instanceCount, instanceStart.count);
  const near = -camera.near;
  _ray.at(1, _ssOrigin);
  _ssOrigin.w = 1;
  _ssOrigin.applyMatrix4(camera.matrixWorldInverse);
  _ssOrigin.applyMatrix4(projectionMatrix);
  _ssOrigin.multiplyScalar(1 / _ssOrigin.w);
  _ssOrigin.x *= resolution.x / 2;
  _ssOrigin.y *= resolution.y / 2;
  _ssOrigin.z = 0;
  _ssOrigin3.copy(_ssOrigin);
  _mvMatrix.multiplyMatrices(camera.matrixWorldInverse, matrixWorld);
  for (let i = 0, l = segmentCount; i < l; i++) {
    _start4.fromBufferAttribute(instanceStart, i);
    _end4.fromBufferAttribute(instanceEnd, i);
    _start4.w = 1;
    _end4.w = 1;
    _start4.applyMatrix4(_mvMatrix);
    _end4.applyMatrix4(_mvMatrix);
    const isBehindCameraNear = _start4.z > near && _end4.z > near;
    if (isBehindCameraNear) {
      continue;
    }
    if (_start4.z > near) {
      const deltaDist = _start4.z - _end4.z;
      const t = (_start4.z - near) / deltaDist;
      _start4.lerp(_end4, t);
    } else if (_end4.z > near) {
      const deltaDist = _end4.z - _start4.z;
      const t = (_end4.z - near) / deltaDist;
      _end4.lerp(_start4, t);
    }
    _start4.applyMatrix4(projectionMatrix);
    _end4.applyMatrix4(projectionMatrix);
    _start4.multiplyScalar(1 / _start4.w);
    _end4.multiplyScalar(1 / _end4.w);
    _start4.x *= resolution.x / 2;
    _start4.y *= resolution.y / 2;
    _end4.x *= resolution.x / 2;
    _end4.y *= resolution.y / 2;
    _line.start.copy(_start4);
    _line.start.z = 0;
    _line.end.copy(_end4);
    _line.end.z = 0;
    const param = _line.closestPointToPointParameter(_ssOrigin3, true);
    _line.at(param, _closestPoint);
    const zPos = MathUtils.lerp(_start4.z, _end4.z, param);
    const isInClipSpace = zPos >= -1 && zPos <= 1;
    const isInside = _ssOrigin3.distanceTo(_closestPoint) < _lineWidth * 0.5;
    if (isInClipSpace && isInside) {
      _line.start.fromBufferAttribute(instanceStart, i);
      _line.end.fromBufferAttribute(instanceEnd, i);
      _line.start.applyMatrix4(matrixWorld);
      _line.end.applyMatrix4(matrixWorld);
      const pointOnLine = new Vector3();
      const point = new Vector3();
      _ray.distanceSqToSegment(_line.start, _line.end, point, pointOnLine);
      intersects.push({
        point,
        pointOnLine,
        distance: _ray.origin.distanceTo(point),
        object: lineSegments,
        face: null,
        faceIndex: i,
        uv: null,
        [UV1]: null
      });
    }
  }
}
class LineSegments2 extends Mesh {
  constructor(geometry = new LineSegmentsGeometry(), material = new LineMaterial({ color: Math.random() * 16777215 })) {
    super(geometry, material);
    this.isLineSegments2 = true;
    this.type = "LineSegments2";
  }
  // for backwards-compatibility, but could be a method of LineSegmentsGeometry...
  computeLineDistances() {
    const geometry = this.geometry;
    const instanceStart = geometry.attributes.instanceStart;
    const instanceEnd = geometry.attributes.instanceEnd;
    const lineDistances = new Float32Array(2 * instanceStart.count);
    for (let i = 0, j = 0, l = instanceStart.count; i < l; i++, j += 2) {
      _start.fromBufferAttribute(instanceStart, i);
      _end.fromBufferAttribute(instanceEnd, i);
      lineDistances[j] = j === 0 ? 0 : lineDistances[j - 1];
      lineDistances[j + 1] = lineDistances[j] + _start.distanceTo(_end);
    }
    const instanceDistanceBuffer = new InstancedInterleavedBuffer(lineDistances, 2, 1);
    geometry.setAttribute("instanceDistanceStart", new InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0));
    geometry.setAttribute("instanceDistanceEnd", new InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1));
    return this;
  }
  raycast(raycaster, intersects) {
    const worldUnits = this.material.worldUnits;
    const camera = raycaster.camera;
    if (camera === null && !worldUnits) {
      console.error(
        'LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.'
      );
    }
    const threshold = raycaster.params.Line2 !== void 0 ? raycaster.params.Line2.threshold || 0 : 0;
    _ray = raycaster.ray;
    const matrixWorld = this.matrixWorld;
    const geometry = this.geometry;
    const material = this.material;
    _lineWidth = material.linewidth + threshold;
    if (geometry.boundingSphere === null) {
      geometry.computeBoundingSphere();
    }
    _sphere.copy(geometry.boundingSphere).applyMatrix4(matrixWorld);
    let sphereMargin;
    if (worldUnits) {
      sphereMargin = _lineWidth * 0.5;
    } else {
      const distanceToSphere = Math.max(camera.near, _sphere.distanceToPoint(_ray.origin));
      sphereMargin = getWorldSpaceHalfWidth(camera, distanceToSphere, material.resolution);
    }
    _sphere.radius += sphereMargin;
    if (_ray.intersectsSphere(_sphere) === false) {
      return;
    }
    if (geometry.boundingBox === null) {
      geometry.computeBoundingBox();
    }
    _box.copy(geometry.boundingBox).applyMatrix4(matrixWorld);
    let boxMargin;
    if (worldUnits) {
      boxMargin = _lineWidth * 0.5;
    } else {
      const distanceToBox = Math.max(camera.near, _box.distanceToPoint(_ray.origin));
      boxMargin = getWorldSpaceHalfWidth(camera, distanceToBox, material.resolution);
    }
    _box.expandByScalar(boxMargin);
    if (_ray.intersectsBox(_box) === false) {
      return;
    }
    if (worldUnits) {
      raycastWorldUnits(this, intersects);
    } else {
      raycastScreenSpace(this, camera, intersects);
    }
  }
  onBeforeRender(renderer) {
    const uniforms = this.material.uniforms;
    if (uniforms && uniforms.resolution) {
      renderer.getViewport(_viewport);
      this.material.uniforms.resolution.value.set(_viewport.z, _viewport.w);
    }
  }
}
class Line2 extends LineSegments2 {
  constructor(geometry = new LineGeometry(), material = new LineMaterial({ color: Math.random() * 16777215 })) {
    super(geometry, material);
    this.isLine2 = true;
    this.type = "Line2";
  }
}
const Line = /* @__PURE__ */ reactExports.forwardRef(function Line4({
  points,
  color = 16777215,
  vertexColors,
  linewidth,
  lineWidth,
  segments,
  dashed,
  ...rest
}, ref) {
  var _vertexColors$, _ref;
  const size = useThree((state) => state.size);
  const line2 = reactExports.useMemo(() => segments ? new LineSegments2() : new Line2(), [segments]);
  const [lineMaterial] = reactExports.useState(() => new LineMaterial());
  const itemSize = (vertexColors == null || (_vertexColors$ = vertexColors[0]) == null ? void 0 : _vertexColors$.length) === 4 ? 4 : 3;
  const lineGeom = reactExports.useMemo(() => {
    const geom = segments ? new LineSegmentsGeometry() : new LineGeometry();
    const pValues = points.map((p) => {
      const isArray = Array.isArray(p);
      return p instanceof Vector3 || p instanceof Vector4 ? [p.x, p.y, p.z] : p instanceof Vector2 ? [p.x, p.y, 0] : isArray && p.length === 3 ? [p[0], p[1], p[2]] : isArray && p.length === 2 ? [p[0], p[1], 0] : p;
    });
    geom.setPositions(pValues.flat());
    if (vertexColors) {
      color = 16777215;
      const cValues = vertexColors.map((c) => c instanceof Color ? c.toArray() : c);
      geom.setColors(cValues.flat(), itemSize);
    }
    return geom;
  }, [points, segments, vertexColors, itemSize]);
  reactExports.useLayoutEffect(() => {
    line2.computeLineDistances();
  }, [points, line2]);
  reactExports.useLayoutEffect(() => {
    if (dashed) {
      lineMaterial.defines.USE_DASH = "";
    } else {
      delete lineMaterial.defines.USE_DASH;
    }
    lineMaterial.needsUpdate = true;
  }, [dashed, lineMaterial]);
  reactExports.useEffect(() => {
    return () => {
      lineGeom.dispose();
      lineMaterial.dispose();
    };
  }, [lineGeom]);
  return /* @__PURE__ */ reactExports.createElement("primitive", _extends({
    object: line2,
    ref
  }, rest), /* @__PURE__ */ reactExports.createElement("primitive", {
    object: lineGeom,
    attach: "geometry"
  }), /* @__PURE__ */ reactExports.createElement("primitive", _extends({
    object: lineMaterial,
    attach: "material",
    color,
    vertexColors: Boolean(vertexColors),
    resolution: [size.width, size.height],
    linewidth: (_ref = linewidth !== null && linewidth !== void 0 ? linewidth : lineWidth) !== null && _ref !== void 0 ? _ref : 1,
    dashed,
    transparent: itemSize === 4
  }, rest)));
});
function fibonacciSphere(n, radius) {
  const points = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < n; i++) {
    const theta = Math.acos(1 - 2 * (i + 0.5) / n);
    const phi = 2 * Math.PI * i / goldenRatio;
    points.push([
      radius * Math.sin(theta) * Math.cos(phi),
      radius * Math.cos(theta),
      radius * Math.sin(theta) * Math.sin(phi)
    ]);
  }
  return points;
}
const NODE_POSITIONS = fibonacciSphere(12, 2.2);
const COLOR_CYAN = new Color(58879);
const COLOR_GOLD = new Color(13934615);
const COLOR_DIM = new Color(1714752);
const COLOR_GREEN = new Color(51534);
const COLOR_BG = new Color(329745);
function ConnectomeNode({
  position,
  hz,
  isOmnis,
  isSovereign
}) {
  const meshRef = reactExports.useRef(null);
  const lightRef = reactExports.useRef(null);
  const baseIntensity = isSovereign ? hz * 1.5 : hz;
  const color = isOmnis ? COLOR_GOLD : hz > 0.7 ? COLOR_CYAN : hz > 0.4 ? COLOR_GREEN : COLOR_DIM;
  const size = 0.06 + hz * 0.12;
  useFrame(() => {
    if (!meshRef.current) return;
    if (isOmnis) {
      const s = 1 + Math.sin(Date.now() * 3e-3) * 0.15;
      meshRef.current.scale.setScalar(s);
    } else {
      meshRef.current.scale.setScalar(1);
    }
    meshRef.current.position.y = position[1] + Math.sin(Date.now() * 5e-4 + position[0]) * 0.03;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("group", { position, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { ref: meshRef, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [size, 16, 16] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meshStandardMaterial",
        {
          color,
          emissive: color,
          emissiveIntensity: 0.4 + baseIntensity * 0.8,
          roughness: 0.2,
          metalness: 0.6
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "pointLight",
      {
        ref: lightRef,
        color,
        intensity: baseIntensity * 0.4,
        distance: 1.5,
        decay: 2
      }
    )
  ] });
}
function ConnectomeLines({
  hz,
  isOmnis,
  aresActive
}) {
  const flashRef = reactExports.useRef(0);
  useFrame(() => {
    if (aresActive) flashRef.current = 1;
    else flashRef.current = Math.max(0, flashRef.current - 0.02);
  });
  const lines = reactExports.useMemo(() => {
    const result = [];
    for (let i = 0; i < 12; i++) {
      for (let j = i + 1; j < 12; j++) {
        const baseOp = (hz[i] ?? 0) * (hz[j] ?? 0) * 0.6;
        if (baseOp > 0.02) {
          result.push({
            points: [NODE_POSITIONS[i], NODE_POSITIONS[j]],
            opacity: Math.min(1, baseOp + flashRef.current * 0.5),
            key: `${i}-${j}`
          });
        }
      }
    }
    return result;
  }, [hz]);
  const lineColor = aresActive ? new Color(16777215) : isOmnis ? COLOR_GOLD : COLOR_CYAN;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: lines.map(({ points, opacity, key }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Line,
    {
      points,
      color: lineColor,
      lineWidth: 1,
      transparent: true,
      opacity
    },
    key
  )) });
}
function ConnectomeScene({
  hz,
  isOmnis,
  aresActive,
  isSovereign
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("color", { attach: "background", args: [COLOR_BG] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ambientLight", { intensity: 0.1 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("pointLight", { position: [5, 5, 5], intensity: 0.3, color: COLOR_CYAN }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("pointLight", { position: [-5, -5, -5], intensity: 0.2, color: COLOR_GOLD }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectomeLines, { hz, isOmnis, aresActive }),
    NODE_POSITIONS.map((pos, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConnectomeNode,
      {
        position: pos,
        hz: hz[i] ?? 0.5,
        isOmnis,
        isSovereign
      },
      i
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      OrbitControls,
      {
        enableZoom: true,
        enablePan: false,
        autoRotate: true,
        autoRotateSpeed: 0.4,
        minDistance: 3,
        maxDistance: 10
      }
    )
  ] });
}
function Connectome3D({ fullscreen }) {
  var _a, _b, _c, _d;
  const canonicalQ = useCanonicalState();
  const ecologyQ = useEcologyState();
  const subOrgQ = useSubOrganismState();
  const isOmnis = ((_a = canonicalQ.data) == null ? void 0 : _a.eg) ?? false;
  const hz = (((_b = ecologyQ.data) == null ? void 0 : _b.freqs) ?? []).slice(0, 12).map((v) => Math.min(1, Math.max(0, v)));
  while (hz.length < 12) hz.push(0.5);
  const aresActive = ((_c = subOrgQ.data) == null ? void 0 : _c.aresActive) ?? false;
  const isSovereign = ((_d = subOrgQ.data) == null ? void 0 : _d.sentActive) ?? false;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Canvas,
    {
      style: {
        height: fullscreen ? "100vh" : "280px",
        width: "100%",
        background: "#050811"
      },
      camera: { position: [0, 0, 7], fov: 60 },
      gl: { antialias: true, alpha: false },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ConnectomeScene,
        {
          hz,
          isOmnis,
          aresActive,
          isSovereign
        }
      )
    }
  );
}
export {
  Connectome3D as default
};
