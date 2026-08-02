import { Suspense, useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import * as THREE from 'three'

// ---------- Layer / node / edge generation ----------------------------

/**
 * Build a deterministic 2D-ish neural-net layout:
 *   - N layers (input, hidden..., output)
 *   - Each layer has a column of nodes positioned vertically
 *   - Edges connect every node in layer i to every node in layer i+1
 *
 * The whole thing is laid out in a 3D space with a slight z-curve so it has depth
 * without feeling like a flat diagram.
 */
function buildNetwork({ layers = [6, 9, 9, 5, 3], spacing = { x: 1.6, y: 0.9, z: 0.6 } } = {}) {
  const nodes = []
  const layerIndexOf = [] // parallel to nodes: which layer each node belongs to
  const depth = layers.length

  for (let li = 0; li < depth; li++) {
    const count = layers[li]
    const t = li / (depth - 1) // 0..1
    const x = (t - 0.5) * (depth - 1) * spacing.x
    // Gentle z-curve so the network isn't perfectly planar.
    const z = Math.sin(t * Math.PI) * spacing.z

    for (let ni = 0; ni < count; ni++) {
      const tNode = count === 1 ? 0.5 : ni / (count - 1)
      const y = (0.5 - tNode) * (count - 1) * spacing.y
      nodes.push([x, y, z])
      layerIndexOf.push(li)
    }
  }

  // Edges: every node in layer i → every node in layer i+1
  const edges = []
  for (let li = 0; li < depth - 1; li++) {
    for (let a = 0; a < nodes.length; a++) {
      if (layerIndexOf[a] !== li) continue
      for (let b = 0; b < nodes.length; b++) {
        if (layerIndexOf[b] !== li + 1) continue
        edges.push([a, b])
      }
    }
  }

  return { nodes, edges, layers, layerIndexOf }
}

// ---------- Instanced nodes (fast, one draw call) ---------------------

function Nodes({ positions, accentRef }) {
  const meshRef = useRef(null)
  const count = positions.length

  // Pre-build per-node "rest" positions and a stable random for per-node offset.
  const data = useMemo(() => {
    return positions.map((p, i) => ({
      base: new THREE.Vector3(...p),
      phase: (i * 0.37) % (Math.PI * 2),
      wobble: 0.04 + (i % 7) * 0.012,
      scale: 0.85 + (i % 5) * 0.06,
    }))
  }, [positions])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    const accent = accentRef.current // THREE.Vector3, updated by PointerPulse
    const a = accent || new THREE.Vector3(0, 0, 0)

    for (let i = 0; i < count; i++) {
      const { base, phase, wobble, scale } = data[i]
      // Subtle ambient breathing on every node.
      const bx = base.x + Math.sin(t * 0.6 + phase) * wobble
      const by = base.y + Math.cos(t * 0.5 + phase * 1.3) * wobble
      const bz = base.z + Math.sin(t * 0.4 + phase * 0.7) * wobble * 0.5

      dummy.position.set(bx, by, bz)
      // Pulse scale based on distance to the cursor's 3D-projected "accent".
      const d = dummy.position.distanceTo(a)
      const pulse = Math.max(0, 1 - d / 2.4)
      const s = scale * (1 + pulse * 0.9)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.085, 16, 16]} />
      <meshStandardMaterial
        color="#B6FF3C"
        emissive="#B6FF3C"
        emissiveIntensity={1.6}
        metalness={0.2}
        roughness={0.35}
      />
    </instancedMesh>
  )
}

// ---------- Edges as a single LineSegments mesh -----------------------

function Edges({ nodes, edges }) {
  const ref = useRef(null)
  const accentRef = useRef(new THREE.Vector3(0, 0, 0))

  // Per-edge data: midpoint + length + phase (for the flowing-pulse animation).
  const edgeData = useMemo(() => {
    return edges.map(([a, b], i) => {
      const va = new THREE.Vector3(...nodes[a])
      const vb = new THREE.Vector3(...nodes[b])
      const mid = va.clone().add(vb).multiplyScalar(0.5)
      const len = va.distanceTo(vb)
      return { a: va, b: vb, mid, len, phase: (i * 0.13) % (Math.PI * 2) }
    })
  }, [nodes, edges])

  // Build a static LineSegments geometry once (positions = segment endpoints).
  // We keep it static; the visual "flow" is done with a custom material's time
  // uniform so we don't have to rebuild geometry every frame.
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const arr = new Float32Array(edges.length * 2 * 3)
    for (let i = 0; i < edges.length; i++) {
      const { a, b } = edgeData[i]
      arr[i * 6 + 0] = a.x
      arr[i * 6 + 1] = a.y
      arr[i * 6 + 2] = a.z
      arr[i * 6 + 3] = b.x
      arr[i * 6 + 4] = b.y
      arr[i * 6 + 5] = b.z
    }
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    // Per-vertex attribute: t (0 at start of edge, 1 at end), used by the shader.
    const t = new Float32Array(edges.length * 2)
    for (let i = 0; i < edges.length; i++) {
      t[i * 2 + 0] = 0
      t[i * 2 + 1] = 1
    }
    g.setAttribute('t', new THREE.BufferAttribute(t, 1))
    return g
  }, [edges, edgeData])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uAccent: { value: new THREE.Vector3(0, 0, 0) },
        uColor: { value: new THREE.Color('#B6FF3C') },
        uColorDim: { value: new THREE.Color('#3a4a1a') },
      },
      vertexShader: /* glsl */ `
        attribute float t;
        varying float vT;
        varying vec3 vWorldPos;
        void main() {
          vT = t;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform float uTime;
        uniform vec3 uAccent;
        uniform vec3 uColor;
        uniform vec3 uColorDim;
        varying float vT;
        varying vec3 vWorldPos;
        void main() {
          // 1) Per-edge pulse: a bright "signal" traveling from start → end.
          float speed = 0.35;
          float pulse = fract(vT - uTime * speed);
          float band = smoothstep(0.0, 0.06, pulse) * (1.0 - smoothstep(0.06, 0.18, pulse));

          // 2) Cursor proximity: brighter the closer the edge is to the accent point.
          float d = distance(vWorldPos, uAccent);
          float proximity = exp(-d * 0.9);

          // 3) Base glow from the line itself.
          float base = 0.18;

          float intensity = base + band * 1.4 + proximity * 0.9;
          vec3 col = mix(uColorDim, uColor, clamp(intensity, 0.0, 1.0));
          // Boost saturation a touch on bright pulses.
          col += uColor * band * 0.6;
          gl_FragColor = vec4(col, clamp(intensity, 0.0, 1.0) * 0.95);
        }
      `,
    })
  }, [])

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.getElapsedTime()
    // Project the current pointer (in NDC) into world space at z=0.
    const { camera, pointer, size } = state
    const ndc = new THREE.Vector3(pointer.x, pointer.y, 0.5)
    ndc.unproject(camera)
    const dir = ndc.sub(camera.position).normalize()
    const dist = -camera.position.z / dir.z
    const world = camera.position.clone().add(dir.multiplyScalar(dist))
    material.uniforms.uAccent.value.copy(world)
    accentRef.current.copy(world)
  })

  // Expose the projected accent to the nodes component.
  useEffect(() => {
    if (ref.current) ref.current.userData.accent = accentRef.current
  }, [])

  return <lineSegments ref={ref} geometry={geometry} material={material} />
}

// ---------- Center "core" — a single object that catches the eye ------

function Core() {
  const ref = useRef(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.x = t * 0.1
    ref.current.rotation.y = t * 0.15
    // Slow scale breath.
    const s = 1 + Math.sin(t * 0.6) * 0.06
    ref.current.scale.setScalar(s)
  })
  return (
    <mesh ref={ref} position={[0, 0, 0.6]}>
      <icosahedronGeometry args={[0.22, 1]} />
      <meshStandardMaterial
        color="#B6FF3C"
        emissive="#B6FF3C"
        emissiveIntensity={2.2}
        metalness={0.4}
        roughness={0.25}
        wireframe={false}
      />
    </mesh>
  )
}

// ---------- Pointer → world-space accent (shared by nodes + edges) ----

function PointerProjector({ sharedRef }) {
  const { camera, pointer } = useThree()
  useFrame(() => {
    const ndc = new THREE.Vector3(pointer.x, pointer.y, 0.5)
    ndc.unproject(camera)
    const dir = ndc.sub(camera.position).normalize()
    const dist = -camera.position.z / dir.z
    const world = camera.position.clone().add(dir.multiplyScalar(dist))
    sharedRef.current.copy(world)
  })
  return null
}

// ---------- Subtle camera parallax ------------------------------------

function Parallax() {
  const { camera, pointer } = useThree()
  useFrame(() => {
    const tx = pointer.x * 0.4
    const ty = pointer.y * 0.3
    camera.position.x += (tx - camera.position.x) * 0.04
    camera.position.y += (ty - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ---------- Background fog (cheap atmosphere, no shader) --------------

function FogBackdrop() {
  return (
    <>
      {/* Large dim halo behind the graph — fake "volumetric" depth. */}
      <mesh position={[0, 0, -3]}>
        <planeGeometry args={[24, 16]} />
        <meshBasicMaterial color="#0A0A0A" />
      </mesh>
      <mesh position={[-3, 1, -2]}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial color="#0e1a05" transparent opacity={0.55} />
      </mesh>
      <mesh position={[3.5, -1, -1.5]}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial color="#0c1604" transparent opacity={0.5} />
      </mesh>
    </>
  )
}

// ---------- The actual graph assembly ---------------------------------

function Graph() {
  const accentRef = useRef(new THREE.Vector3(0, 0, 0))
  const { nodes, edges } = useMemo(() => buildNetwork(), [])
  return (
    <>
      <PointerProjector sharedRef={accentRef} />
      <group rotation={[0.05, 0, -0.05]}>
        <Edges nodes={nodes} edges={edges} />
        <Nodes positions={nodes} accentRef={accentRef} />
        <Core />
      </group>
    </>
  )
}

// ---------- Public scene ---------------------------------------------

export default function NeuralGraph() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 38 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <fog attach="fog" args={['#0A0A0A', 6, 18]} />
      <color attach="background" args={['#0A0A0A']} />

      {/* Lighting — mostly emissive, but a soft key light for the core. */}
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 0, 4]} intensity={1.4} color="#B6FF3C" />
      <pointLight position={[3, -2, 3]} intensity={0.4} color="#ffffff" />

      <Suspense fallback={null}>
        <FogBackdrop />
        <Graph />
      </Suspense>

      <Parallax />

      {/* Bloom — the single most important thing for making this feel "alive".
          postprocessing's Bloom is cheap; the kernel size is intentionally large
          so the glow is soft rather than crunchy. */}
      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom
          intensity={0.9}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.6}
          kernelSize={KernelSize.LARGE}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  )
}
