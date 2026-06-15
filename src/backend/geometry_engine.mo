// ============================================================
// NEUROEMERGENCE CORE — 4D TO 8D GEOMETRY ENGINE
// Quaternion, Octonion, E8 Lattice, Tesseract, Penrose Tiling,
// Hopf Fibration, Calabi-Yau Manifold, 96-Node Expansion
// Classification: TOP SECRET PROPRIETARY
// Owner: Alfredo Medina Hernandez | Dallas TX 2026
// ============================================================

import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Nat32 "mo:core/Nat32";

module {

  // ────────────────────────────────────────────────────────────
  // SOVEREIGN CONSTANTS — sealed at 19 decimal precision
  // ────────────────────────────────────────────────────────────
  public let PHI  : Float = 1.6180339887498948482;
  // PHI² = PHI + 1
  public let PHI2 : Float = 2.6180339887498948482;
  // PHI⁴
  public let PHI4 : Float = 6.8541019662496847430;
  // PHI⁵
  public let PHI5 : Float = 11.090169943749474241;
  // PHI⁶
  public let PHI6 : Float = 17.944271909999158985;
  // PHI⁷
  public let PHI7 : Float = 29.034441853748633226;

  // Schumann resonance ground frequency (Hz)
  public let SCHUMANN : Float = 7.83;

  // Royal cubit: π/6 metres — spatial unit for all node geometry
  public let ROYAL_CUBIT : Float = 0.5235987755982988730;

  let PI      : Float = 3.14159265358979323846;
  let TWO_PI  : Float = 6.28318530717958647692;

  // Golden angle in degrees (stagger per ring, 360/PHI²)
  let GOLDEN_ANGLE_DEG : Float = 137.5077640500378546463;
  let GOLDEN_ANGLE_RAD : Float = 2.39996322972865332224;

  // ============================================================
  // SECTION 1 — QUATERNION ALGEBRA
  // Replaces all Euler floats in the organism
  // q = w + xi + yj + zk
  // ============================================================

  public type Quaternion = {
    w : Float;
    x : Float;
    y : Float;
    z : Float;
  };

  public let QUAT_IDENTITY : Quaternion = { w = 1.0; x = 0.0; y = 0.0; z = 0.0 };

  // Hamilton product: q1 ⊗ q2
  public func quaternionMultiply(q1 : Quaternion, q2 : Quaternion) : Quaternion {
    {
      w = q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z;
      x = q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y;
      y = q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x;
      z = q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w;
    }
  };

  // Euclidean norm: √(w²+x²+y²+z²)
  public func quaternionNorm(q : Quaternion) : Float {
    _sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z)
  };

  // Normalize to unit quaternion
  public func quaternionNormalize(q : Quaternion) : Quaternion {
    let n = quaternionNorm(q);
    if (n < 1.0e-12) { QUAT_IDENTITY }
    else { { w = q.w / n; x = q.x / n; y = q.y / n; z = q.z / n } }
  };

  // Conjugate: (w, -x, -y, -z)
  public func quaternionConjugate(q : Quaternion) : Quaternion {
    { w = q.w; x = -q.x; y = -q.y; z = -q.z }
  };

  // Rotate 3D vector v by unit quaternion q: v' = q·(0,v)·q*
  public func quaternionRotate(v : (Float, Float, Float), q : Quaternion) : (Float, Float, Float) {
    let (vx, vy, vz) = v;
    let qv : Quaternion = { w = 0.0; x = vx; y = vy; z = vz };
    let qn  = quaternionNormalize(q);
    let qc  = quaternionConjugate(qn);
    let res = quaternionMultiply(quaternionMultiply(qn, qv), qc);
    (res.x, res.y, res.z)
  };

  // Rotation quaternion from axis-angle
  // q = cos(θ/2) + sin(θ/2)·(xi+yj+zk)
  public func fromAxisAngle(axis : (Float, Float, Float), angle : Float) : Quaternion {
    let (ax, ay, az) = axis;
    let axisLen = _sqrt(ax * ax + ay * ay + az * az);
    if (axisLen < 1.0e-12) { return QUAT_IDENTITY };
    let nx = ax / axisLen;
    let ny = ay / axisLen;
    let nz = az / axisLen;
    let half = angle * 0.5;
    let s = _sin(half);
    { w = _cos(half); x = s * nx; y = s * ny; z = s * nz }
  };

  // Spherical linear interpolation between two quaternions
  public func slerp(q1 : Quaternion, q2 : Quaternion, t : Float) : Quaternion {
    let a  = quaternionNormalize(q1);
    var bw = q2.w; var bx = q2.x; var by = q2.y; var bz = q2.z;
    let bn = _sqrt(bw * bw + bx * bx + by * by + bz * bz);
    if (bn > 1.0e-12) { bw /= bn; bx /= bn; by /= bn; bz /= bn };
    var dot = a.w * bw + a.x * bx + a.y * by + a.z * bz;
    if (dot < 0.0) {
      bw := -bw; bx := -bx; by := -by; bz := -bz;
      dot := -dot;
    };
    if (dot > 0.9995) {
      // Linear fallback
      return quaternionNormalize({
        w = a.w + t * (bw - a.w);
        x = a.x + t * (bx - a.x);
        y = a.y + t * (by - a.y);
        z = a.z + t * (bz - a.z);
      })
    };
    let theta0 = _acos(_clamp(dot, -1.0, 1.0));
    let theta  = theta0 * t;
    let sinT0  = _sin(theta0);
    let sinT   = _sin(theta);
    let s1 = _cos(theta) - dot * sinT / sinT0;
    let s2 = sinT / sinT0;
    quaternionNormalize({
      w = s1 * a.w + s2 * bw;
      x = s1 * a.x + s2 * bx;
      y = s1 * a.y + s2 * by;
      z = s1 * a.z + s2 * bz;
    })
  };

  // ============================================================
  // SECTION 2 — OCTONION ALGEBRA
  // 8D non-associative division algebra (Cayley numbers)
  // Fano plane 7-cycle: (1,2,4),(2,3,5),(3,4,6),(4,5,7),(5,6,1),(6,7,2),(7,1,3)
  // e_i * e_j = +e_k if (i,j,k) is a directed triple
  // e_j * e_i = -e_k  (anti-commutativity)
  // e_i * e_i = -e_0
  // e_0 is identity
  // ============================================================

  public type Octonion = {
    e0 : Float; e1 : Float; e2 : Float; e3 : Float;
    e4 : Float; e5 : Float; e6 : Float; e7 : Float;
  };

  public let OCTO_IDENTITY : Octonion = {
    e0 = 1.0; e1 = 0.0; e2 = 0.0; e3 = 0.0;
    e4 = 0.0; e5 = 0.0; e6 = 0.0; e7 = 0.0;
  };

  // Returns (sign, k): e_i * e_j = sign * e_k
  private func _fanoProduct(i : Nat, j : Nat) : (Float, Nat) {
    if (i == 0) { return (1.0, j) };
    if (j == 0) { return (1.0, i) };
    if (i == j) { return (-1.0, 0) };
    // Directed Fano triples (a,b,c): e_a*e_b=+e_c
    let a0:Nat=1; let b0:Nat=2; let c0:Nat=4;
    let a1:Nat=2; let b1:Nat=3; let c1:Nat=5;
    let a2:Nat=3; let b2:Nat=4; let c2:Nat=6;
    let a3:Nat=4; let b3:Nat=5; let c3:Nat=7;
    let a4:Nat=5; let b4:Nat=6; let c4:Nat=1;
    let a5:Nat=6; let b5:Nat=7; let c5:Nat=2;
    let a6:Nat=7; let b6:Nat=1; let c6:Nat=3;
    let trA = [a0,a1,a2,a3,a4,a5,a6];
    let trB = [b0,b1,b2,b3,b4,b5,b6];
    let trC = [c0,c1,c2,c3,c4,c5,c6];
    var t : Nat = 0;
    while (t < 7) {
      let a = trA[t]; let b = trB[t]; let c = trC[t];
      if (a == i and b == j) { return (1.0, c) };
      if (b == i and a == j) { return (-1.0, c) };
      if (b == i and c == j) { return (1.0, a) };
      if (c == i and b == j) { return (-1.0, a) };
      if (c == i and a == j) { return (1.0, b) };
      if (a == i and c == j) { return (-1.0, b) };
      t += 1;
    };
    (0.0, 0)
  };

  // Full octonion multiplication using Fano plane
  public func octonionMultiply(a : Octonion, b : Octonion) : Octonion {
    let aArr : [Float] = [a.e0, a.e1, a.e2, a.e3, a.e4, a.e5, a.e6, a.e7];
    let bArr : [Float] = [b.e0, b.e1, b.e2, b.e3, b.e4, b.e5, b.e6, b.e7];
    var res : [var Float] = [var 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    var i : Nat = 0;
    while (i < 8) {
      let ai = aArr[i];
      if (ai != 0.0) {
        var j : Nat = 0;
        while (j < 8) {
          let bj = bArr[j];
          if (bj != 0.0) {
            let (sign, k) = _fanoProduct(i, j);
            res[k] += sign * ai * bj;
          };
          j += 1;
        };
      };
      i += 1;
    };
    { e0=res[0]; e1=res[1]; e2=res[2]; e3=res[3]; e4=res[4]; e5=res[5]; e6=res[6]; e7=res[7] }
  };

  // Octonion norm: √(e0²+…+e7²)
  public func octonionNorm(o : Octonion) : Float {
    _sqrt(
      o.e0*o.e0 + o.e1*o.e1 + o.e2*o.e2 + o.e3*o.e3 +
      o.e4*o.e4 + o.e5*o.e5 + o.e6*o.e6 + o.e7*o.e7
    )
  };

  // Octonion conjugate: (e0, -e1, …, -e7)
  public func octonionConjugate(o : Octonion) : Octonion {
    { e0=o.e0; e1= -o.e1; e2= -o.e2; e3= -o.e3;
      e4= -o.e4; e5= -o.e5; e6= -o.e6; e7= -o.e7 }
  };

  // Normalize to unit norm
  public func octonionNormalize(o : Octonion) : Octonion {
    let n = octonionNorm(o);
    if (n < 1.0e-12) { return OCTO_IDENTITY };
    { e0=o.e0/n; e1=o.e1/n; e2=o.e2/n; e3=o.e3/n;
      e4=o.e4/n; e5=o.e5/n; e6=o.e6/n; e7=o.e7/n }
  };

  // Embed quaternion into octonion (w→e0, x→e1, y→e2, z→e3)
  public func quaternionToOctonion(q : Quaternion) : Octonion {
    { e0=q.w; e1=q.x; e2=q.y; e3=q.z; e4=0.0; e5=0.0; e6=0.0; e7=0.0 }
  };

  // ============================================================
  // SECTION 3 — E8 LATTICE (240 root vectors)
  // First 112: all (±1,±1,0,0,0,0,0,0) permutations — C(8,2)×4=112
  // Next 128: (±½,…,±½) with even number of minus signs
  // ============================================================

  // Count set bits (popcount) of 8-bit number
  private func _popcount8(n : Nat) : Nat {
    var x = n % 256;
    var bits : Nat = 0;
    var i : Nat = 0;
    while (i < 8) {
      if (x % 2 == 1) { bits += 1 };
      x := x / 2;
      i += 1;
    };
    bits
  };

  // Return the localIdx-th integer in 0..255 with even popcount
  private func _evenParityPattern(localIdx : Nat) : Nat {
    var count : Nat = 0;
    var n : Nat = 0;
    while (n < 256) {
      if (_popcount8(n) % 2 == 0) {
        if (count == localIdx) { return n };
        count += 1;
      };
      n += 1;
    };
    0
  };

  // Map pairIdx (0-27) to the pair of 8-dimensional positions (p1, p2)
  // There are C(8,2) = 28 pairs
  private func _positionPair(pairIdx : Nat) : (Nat, Nat) {
    var count : Nat = 0;
    var ii : Nat = 0;
    while (ii < 8) {
      var jj : Nat = ii + 1;
      while (jj < 8) {
        if (count == pairIdx) { return (ii, jj) };
        count += 1;
        jj += 1;
      };
      ii += 1;
    };
    (0, 1)
  };

  // Returns idx-th E8 root vector (0-239) as [Float] length 8
  public func e8RootVector(idx : Nat) : [Float] {
    if (idx < 112) {
      // (±1,±1) in two positions
      let pairIdx = idx / 4;
      let signIdx = idx % 4;
      let (p1, p2) = _positionPair(pairIdx);
      let s1 : Float = if (signIdx < 2)  { 1.0 } else { -1.0 };
      let s2 : Float = if (signIdx % 2 == 0) { 1.0 } else { -1.0 };
      Array.tabulate<Float>(8, func(k) {
        if (k == p1) { s1 } else if (k == p2) { s2 } else { 0.0 }
      })
    } else {
      // (±½,…) with even number of minus signs
      let localIdx = idx - 112;
      let signBits = _evenParityPattern(localIdx % 128);
      Array.tabulate<Float>(8, func(k) {
        let bit = Nat.bitshiftRight(signBits, Nat32.fromNat(k)) % 2;
        if (bit == 0) { 0.5 } else { -0.5 }
      })
    }
  };

  // Map organism node 0-95 into E8 subspace (nodeId mod 240)
  public func e8NodeMapping(nodeId : Nat) : [Float] {
    e8RootVector(nodeId % 240)
  };

  // Coupling strength = dot product of E8 root vectors of two nodes
  public func e8Coupling(node1 : Nat, node2 : Nat) : Float {
    let v1 = e8NodeMapping(node1);
    let v2 = e8NodeMapping(node2);
    var dot : Float = 0.0;
    var k : Nat = 0;
    while (k < 8) {
      dot += v1[k] * v2[k];
      k += 1;
    };
    dot
  };

  // E8 symmetry score: fraction of 96-node pairs with E8-lattice dot products
  // In E8, nearest-neighbor dot products are 0, ±½, or ±1
  public func e8SymmetryScore() : Float {
    var aligned : Float = 0.0;
    var total   : Float = 0.0;
    var i : Nat = 0;
    while (i < 96) {
      var j : Nat = i + 1;
      while (j < 96) {
        let c    = e8Coupling(i, j);
        let cAbs = _abs(c);
        if (cAbs < 0.01 or (cAbs > 0.49 and cAbs < 0.51) or (cAbs > 0.99 and cAbs < 1.01)) {
          aligned += 1.0;
        };
        total += 1.0;
        j += 1;
      };
      i += 1;
    };
    if (total < 1.0) { 0.0 } else { aligned / total }
  };

  // ============================================================
  // SECTION 4 — TESSERACT TOPOLOGY (4D hypercube)
  // 16 vertices: (±1,±1,±1,±1)
  // 32 edges: vertex pairs differing in exactly one bit
  // ============================================================

  // Returns 4D coordinates of vertex idx (0-15)
  // Bit k of idx encodes sign of dimension k: 0→+1, 1→-1
  public func tesseractVertex(idx : Nat) : (Float, Float, Float, Float) {
    let i = idx % 16;
    let s0 : Float = if (i % 2        == 0) { 1.0 } else { -1.0 };
    let s1 : Float = if ((i / 2) % 2  == 0) { 1.0 } else { -1.0 };
    let s2 : Float = if ((i / 4) % 2  == 0) { 1.0 } else { -1.0 };
    let s3 : Float = if ((i / 8) % 2  == 0) { 1.0 } else { -1.0 };
    (s0, s1, s2, s3)
  };

  // Returns (vertex1, vertex2) for edge idx (0-31)
  // Edges connect vertices differing in exactly one bit
  public func tesseractEdge(idx : Nat) : (Nat, Nat) {
    let e = idx % 32;
    var count : Nat = 0;
    var v : Nat = 0;
    while (v < 16) {
      var b : Nat = 0;
      while (b < 4) {
        // XOR: vf = v with bit b flipped
        let vf = _natXorBit(v, b);
        if (v < vf) {
          if (count == e) { return (v, vf) };
          count += 1;
        };
        b += 1;
      };
      v += 1;
    };
    (0, 1)
  };

  // 4D isoclinic rotation in xw-plane (angle1) and yz-plane (angle2)
  // x' = x·cos(a1) - w·sin(a1)
  // y' = y·cos(a2) - z·sin(a2)
  // z' = z·cos(a2) + y·sin(a2)
  // w' = w·cos(a1) + x·sin(a1)
  public func tesseractRotate4D(
    vertex : (Float, Float, Float, Float),
    angle1 : Float,
    angle2 : Float
  ) : (Float, Float, Float, Float) {
    let (x, y, z, w) = vertex;
    let c1 = _cos(angle1); let s1 = _sin(angle1);
    let c2 = _cos(angle2); let s2 = _sin(angle2);
    (x*c1 - w*s1, y*c2 - z*s2, z*c2 + y*s2, w*c1 + x*s1)
  };

  // Stereographic projection 4D→3D from north pole (0,0,0,1)
  // (x,y,z,w) → (x/(1-w), y/(1-w), z/(1-w))
  public func project4Dto3D(vertex : (Float, Float, Float, Float)) : (Float, Float, Float) {
    let (x, y, z, w) = vertex;
    let denom = 1.0 - w;
    if (_abs(denom) < 1.0e-12) {
      (x * 1.0e6, y * 1.0e6, z * 1.0e6)
    } else {
      (x / denom, y / denom, z / denom)
    }
  };

  // Map 96 organism nodes to tesseract space
  // 16 vertices × 6 = 96. Each vertex hosts 6 nodes offset in w by PHI-ratio spacing.
  public func nodeToTesseract(nodeId : Nat) : (Float, Float, Float, Float) {
    let n         = nodeId % 96;
    let vertexIdx = n % 16;
    let subIdx    = n / 16; // 0-5: which of 6 nodes at this vertex
    let (x, y, z, w) = tesseractVertex(vertexIdx);
    let wOffset = subIdx.toFloat() * (1.0 / PHI) * 0.2;
    (x, y, z, w + wOffset)
  };

  // ============================================================
  // SECTION 5 — PENROSE TILING (aperiodic memory addressing)
  // Thin rhombus (36°), thick rhombus (72°). Ratio → PHI.
  // ============================================================

  // Returns "thick" or "thin" for Penrose position (x,y)
  // tan(π/5) = tan(36°) ≈ 0.72654253340707882942
  public func penroseTileType(x : Float, y : Float) : Text {
    let tan36 : Float = 0.72654253340707882942;
    let val   = x + y / tan36;
    // fractional floor mod 2
    let fl    = _floor(val);
    let mod2  = fl - 2.0 * _floor(fl / 2.0);
    if (_abs(mod2) < 0.5) { "thick" } else { "thin" }
  };

  // Map memory index to unique Penrose position
  // x = (memoryId × PHI)  mod 1 × 100
  // y = (memoryId × PHI²) mod 1 × 100
  public func penroseAddress(memoryId : Nat) : (Float, Float) {
    let m   = memoryId.toFloat();
    let rawX = m * PHI;
    let rawY = m * PHI2;
    let fx   = rawX - _floor(rawX);
    let fy   = rawY - _floor(rawY);
    (fx * 100.0, fy * 100.0)
  };

  // Tile type at a memory ID (organism's memory addressing)
  public func memoryTileType(memoryId : Nat) : Text {
    let (x, y) = penroseAddress(memoryId);
    penroseTileType(x, y)
  };

  // ============================================================
  // SECTION 6 — HOPF FIBRATION (state space topology)
  // S³ → S² with fiber S¹
  // Observable output = S². Internal states = S¹ fibers.
  // ============================================================

  // Hopf map: unit quaternion → point on S²
  // hx = 2(xw + yz)
  // hy = 2(yw − xz)
  // hz = w² + z² − x² − y²
  public func hopfMap(q : Quaternion) : (Float, Float, Float) {
    let qn = quaternionNormalize(q);
    let hx = 2.0 * (qn.x * qn.w + qn.y * qn.z);
    let hy = 2.0 * (qn.y * qn.w - qn.x * qn.z);
    let hz = qn.w * qn.w + qn.z * qn.z - qn.x * qn.x - qn.y * qn.y;
    (hx, hy, hz)
  };

  // Inverse Hopf: S² point + fiber angle → S³ quaternion
  // α = arccos(pz)/2, φ = atan2(py,px)/2
  // q(θ) = (cos(α)cos(φ+θ), cos(α)sin(φ+θ), sin(α)cos(θ), sin(α)sin(θ))
  public func hopfFiber(p : (Float, Float, Float), fiberAngle : Float) : Quaternion {
    let (px, py, pz) = p;
    let alpha = _acos(_clamp(pz, -1.0, 1.0)) * 0.5;
    let phi   = _atan2(py, px) * 0.5;
    let theta = fiberAngle;
    {
      w = _cos(alpha) * _cos(phi + theta);
      x = _cos(alpha) * _sin(phi + theta);
      y = _sin(alpha) * _cos(theta);
      z = _sin(alpha) * _sin(theta);
    }
  };

  // Organism full state space: (observableOutput, internalAngle) → 4D S³ point
  public func hopfStateSpace(observableOutput : Float, internalAngle : Float) : (Float, Float, Float, Float) {
    let colatitude = observableOutput * PI;
    let pz  = _cos(colatitude);
    let sc  = _sin(colatitude);
    let px  = sc * _cos(internalAngle);
    let py  = sc * _sin(internalAngle);
    let q   = hopfFiber((px, py, pz), internalAngle);
    (q.w, q.x, q.y, q.z)
  };

  // ============================================================
  // SECTION 7 — CALABI-YAU MANIFOLD (hidden dimension space)
  // Fermat quintic in CP⁴. Practical 6D projection via spherical embedding.
  // ============================================================

  // 6D projection from 3 parameters
  public func calabiYauPoint(t1 : Float, t2 : Float, t3 : Float) : (Float, Float, Float, Float, Float, Float) {
    let s1 = _sin(t1); let c1 = _cos(t1);
    let s2 = _sin(t2); let c2 = _cos(t2);
    let s3 = _sin(t3); let c3 = _cos(t3);
    let phiT1 = PHI * t1;
    let sPhi  = _sin(phiT1); let cPhi = _cos(phiT1);
    let x0 = c1;
    let x1 = s1 * c2;
    let x2 = s1 * s2 * c3;
    let x3 = s1 * s2 * s3 * cPhi;
    let x4 = s1 * s2 * s3 * sPhi * c2;
    let x5 = s1 * s2 * s3 * sPhi * s2;
    (x0, x1, x2, x3, x4, x5)
  };

  // Map law (0-59) to Calabi-Yau parameter triple
  // t1 = (id/60) × 2π,  t2 = (id/60) × 4π,  t3 = (id/60) × PHI × 2π
  public func lawDimensionMapping(lawId : Nat) : (Float, Float, Float) {
    let f = (lawId % 60).toFloat() / 60.0;
    (f * TWO_PI, f * 4.0 * PI, f * PHI * TWO_PI)
  };

  // Full 6D Calabi-Yau coordinates for a law
  public func lawCalabiYauCoords(lawId : Nat) : (Float, Float, Float, Float, Float, Float) {
    let (t1, t2, t3) = lawDimensionMapping(lawId);
    calabiYauPoint(t1, t2, t3)
  };

  // ============================================================
  // SECTION 8 — 96-NODE EXPANSION (8 rings × 12 nodes)
  // Ring 6: OMNIS apex  — r=PHI^6, f=27.0 Hz (Gamma high)
  // Ring 7: External    — r=PHI^7, f=43.7 Hz (ultra-high)
  // ============================================================

  public let RING_FREQ_96 : [Float] = [
    0.625,  // Ring 0: delta
    1.25,   // Ring 1: slow delta
    2.5,    // Ring 2: delta peak
    5.0,    // Ring 3: theta
    10.0,   // Ring 4: alpha
    20.0,   // Ring 5: beta
    27.0,   // Ring 6: OMNIS apex (Gamma high)
    43.7,   // Ring 7: external distribution
  ];

  // Ring radius: PHI^ring
  public func ringRadius(ring : Nat) : Float { _phiPow(ring) };

  // Ring height: ring × royal_cubit
  public func ringHeight(ring : Nat) : Float {
    ring.toFloat() * ROYAL_CUBIT
  };

  // 4D position for node (ring, idx) — golden angle stagger per ring
  // angle = idx × 30° + ring × GOLDEN_ANGLE_DEG  (in radians)
  // radius = PHI^ring
  // z = height × cos(ring × GOLDEN_ANGLE_RAD)
  // w = height × sin(ring × GOLDEN_ANGLE_RAD)
  public func expandedNodePosition(ring : Nat, idx : Nat) : (Float, Float, Float, Float) {
    let r   = ringRadius(ring);
    let h   = ringHeight(ring);
    let deg = idx.toFloat() * 30.0 + ring.toFloat() * GOLDEN_ANGLE_DEG;
    let rad = deg * PI / 180.0;
    let x   = r * _cos(rad);
    let y   = r * _sin(rad);
    let z   = h * _cos(ring.toFloat() * GOLDEN_ANGLE_RAD);
    let w   = h * _sin(ring.toFloat() * GOLDEN_ANGLE_RAD);
    (x, y, z, w)
  };

  // Unit quaternion encoding of node (ring, idx) position
  public func nodeToQuaternion(ring : Nat, idx : Nat) : Quaternion {
    let (x, y, z, w) = expandedNodePosition(ring, idx);
    let q : Quaternion = { w; x; y; z };
    quaternionNormalize(q)
  };

  // 8D E8 subspace position for node — PHI-weighted blend of E8 root + quaternion
  public func nodeE8Subspace(nodeId : Nat) : [Float] {
    let e8v  = e8NodeMapping(nodeId);
    let ring = nodeId / 12;
    let idx  = nodeId % 12;
    let q    = nodeToQuaternion(ring % 8, idx);
    let invP = 1.0 / PHI;
    [
      e8v[0] * PHI + q.w * invP,
      e8v[1] * PHI + q.x * invP,
      e8v[2] * PHI + q.y * invP,
      e8v[3] * PHI + q.z * invP,
      e8v[4] * invP + q.w * PHI,
      e8v[5] * invP + q.x * PHI,
      e8v[6] * invP + q.y * PHI,
      e8v[7] * invP + q.z * PHI,
    ]
  };

  // ============================================================
  // PUBLIC EXPORT TYPES (shared — no var fields, no mutable containers)
  // ============================================================

  public type GeometryState = {
    tesseractAngle1      : Float;
    tesseractAngle2      : Float;
    hopfFiberAngles      : [Float]; // 96 entries
    penroseThickFraction : Float;
    e8SymScore           : Float;
    activeRingCount      : Nat;
    beat                 : Nat;
  };

  public type NodeGeometry = {
    nodeId         : Nat;
    ring           : Nat;
    idx            : Nat;
    x4D            : Float;
    y4D            : Float;
    z4D            : Float;
    w4D            : Float;
    quatW          : Float;
    quatX          : Float;
    quatY          : Float;
    quatZ          : Float;
    hopfX          : Float;
    hopfY          : Float;
    hopfZ          : Float;
    penroseX       : Float;
    penroseY       : Float;
    penroseTile    : Text;
    e8Subspace     : [Float];
  };

  // ============================================================
  // PURE COMPUTATION FUNCTIONS (called from actor)
  // ============================================================

  // Full geometry for one node
  public func computeNodeGeometryPure(nodeId : Nat) : NodeGeometry {
    let ring = nodeId / 12;
    let idx  = nodeId % 12;
    let (x4, y4, z4, w4) = expandedNodePosition(ring % 8, idx);
    let q = nodeToQuaternion(ring % 8, idx);
    let (hx, hy, hz) = hopfMap(q);
    let (px, py) = penroseAddress(nodeId);
    {
      nodeId;
      ring;
      idx;
      x4D = x4; y4D = y4; z4D = z4; w4D = w4;
      quatW = q.w; quatX = q.x; quatY = q.y; quatZ = q.z;
      hopfX = hx; hopfY = hy; hopfZ = hz;
      penroseX = px; penroseY = py;
      penroseTile = penroseTileType(px, py);
      e8Subspace  = nodeE8Subspace(nodeId);
    }
  };

  // Coupling between two nodes via quaternion dot product
  public func quaternionCouplingPure(node1 : Nat, node2 : Nat) : Float {
    let q1 = nodeToQuaternion((node1 / 12) % 8, node1 % 12);
    let q2 = nodeToQuaternion((node2 / 12) % 8, node2 % 12);
    _abs(q1.w * q2.w + q1.x * q2.x + q1.y * q2.y + q1.z * q2.z)
  };

  // Octonion field strength across 8 rings (E8 alignment)
  public func octonionFieldStrengthPure() : Float {
    var total : Float = 0.0;
    var ring : Nat = 0;
    while (ring < 8) {
      var wS : Float = 0.0; var xS : Float = 0.0;
      var yS : Float = 0.0; var zS : Float = 0.0;
      var n : Nat = 0;
      while (n < 12) {
        let q = nodeToQuaternion(ring, n);
        wS += q.w; xS += q.x; yS += q.y; zS += q.z;
        n += 1;
      };
      let qAvg = quaternionNormalize({ w = wS / 12.0; x = xS / 12.0; y = yS / 12.0; z = zS / 12.0 });
      total += octonionNorm(quaternionToOctonion(qAvg));
      ring += 1;
    };
    _clamp((total / 8.0) * (1.0 / PHI), 0.0, 1.0)
  };

  // Build geometry state snapshot for the current beat
  public func buildGeometryState(beat : Nat) : GeometryState {
    let bf    = beat.toFloat();
    let a1    = bf * (TWO_PI / PHI4) * 0.001;
    let a2    = bf * (TWO_PI / PHI5) * 0.001;
    let hopfAngles = Array.tabulate(96, func(n) {
      let q = nodeToQuaternion((n / 12) % 8, n % 12);
      let (_, _, hz) = hopfMap(q);
      _acos(_clamp(hz, -1.0, 1.0))
    });
    var thickCnt : Float = 0.0;
    var ni : Nat = 0;
    while (ni < 96) {
      if (memoryTileType(ni) == "thick") { thickCnt += 1.0 };
      ni += 1;
    };
    {
      tesseractAngle1      = a1;
      tesseractAngle2      = a2;
      hopfFiberAngles      = hopfAngles;
      penroseThickFraction = thickCnt / 96.0;
      e8SymScore           = e8SymmetryScore();
      activeRingCount      = 8;
      beat;
    }
  };

  // ============================================================
  // PRIVATE MATH PRIMITIVES
  // All trig computed via Taylor/Newton — no external Float.sin dependency
  // ============================================================

  // sin(x) — range-reduced to [-π,π], 7-term Taylor series
  private func _sin(x : Float) : Float {
    var xx = x;
    while (xx >  PI) { xx -= TWO_PI };
    while (xx < -PI) { xx += TWO_PI };
    let x2 = xx * xx;
    xx * (1.0 - x2 * (1.0/6.0 - x2 * (1.0/120.0 - x2 * (1.0/5040.0))))
  };

  // cos(x) — range-reduced to [-π,π], 7-term Taylor series
  private func _cos(x : Float) : Float {
    var xx = x;
    while (xx >  PI) { xx -= TWO_PI };
    while (xx < -PI) { xx += TWO_PI };
    let x2 = xx * xx;
    1.0 - x2 * (0.5 - x2 * (1.0/24.0 - x2 * (1.0/720.0)))
  };

  // Newton-Raphson square root (20 iterations)
  private func _sqrt(x : Float) : Float {
    if (x <= 0.0) { return 0.0 };
    var g = x * 0.5;
    var i : Nat = 0;
    while (i < 20) {
      let next = (g + x / g) * 0.5;
      if (_abs(next - g) < 1.0e-15) { return next };
      g := next;
      i += 1;
    };
    g
  };

  private func _abs(x : Float) : Float { if (x < 0.0) { -x } else { x } };

  private func _clamp(x : Float, lo : Float, hi : Float) : Float {
    if (x < lo) { lo } else if (x > hi) { hi } else { x }
  };

  // Nat XOR for bit b: flips bit b of n (n < 256, b < 8)
  private func _natXorBit(n : Nat, b : Nat) : Nat {
    let mask = Nat.bitshiftLeft(1, Nat32.fromNat(b));
    let bit  = Nat.bitshiftRight(n, Nat32.fromNat(b)) % 2;
    if (bit == 0) { n + mask } else { n - mask }
  };

  // Floor via Float arithmetic
  private func _floor(x : Float) : Float {
    let t = (x.toInt()).toFloat();
    if (x < t) { t - 1.0 } else { t }
  };

  // atan(x) — Maclaurin for |x|≤1, identity for |x|>1
  private func _atanCore(x : Float) : Float {
    let x2 = x * x;
    x * (1.0 - x2 * (1.0/3.0 - x2 * (1.0/5.0 - x2 * (1.0/7.0 - x2 * (1.0/9.0 - x2 / 11.0)))))
  };

  private func _atan(x : Float) : Float {
    if (_abs(x) > 1.0) {
      let s : Float = if (x > 0.0) { 1.0 } else { -1.0 };
      s * (PI / 2.0 - _atanCore(1.0 / _abs(x)))
    } else {
      _atanCore(x)
    }
  };

  private func _atan2(y : Float, x : Float) : Float {
    if      (x > 0.0)                  { _atan(y / x) }
    else if (x < 0.0 and y >= 0.0)    { _atan(y / x) + PI }
    else if (x < 0.0)                 { _atan(y / x) - PI }
    else if (y > 0.0)                 { PI / 2.0 }
    else if (y < 0.0)                 { -PI / 2.0 }
    else                              { 0.0 }
  };

  private func _acos(x : Float) : Float {
    let xc = _clamp(x, -1.0, 1.0);
    _atan2(_sqrt(1.0 - xc * xc), xc)
  };

  // PHI raised to natural number power (iterative, exact to Float precision)
  private func _phiPow(n : Nat) : Float {
    var r : Float = 1.0;
    var i : Nat = 0;
    while (i < n) { r *= PHI; i += 1 };
    r
  };

}
