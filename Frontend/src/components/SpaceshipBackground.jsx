import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Animated Stars Component with enhanced visuals
function AnimatedStars() {
  const starsRef = useRef()
  
  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.x = state.clock.elapsedTime * 0.01
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.015
    }
  })
  
  return (
    <Stars 
      ref={starsRef} 
      radius={120} 
      depth={60} 
      count={7000} 
      factor={5} 
      saturation={0.2} 
      fade 
      speed={2} 
    />
  )
}

// Enhanced Spaceship Model with better geometry
function Spaceship() {
  const meshRef = useRef()
  const { viewport } = useThree()
  const glowRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Smooth floating animation
    meshRef.current.position.y = Math.sin(time * 0.4) * 0.4
    meshRef.current.position.x = Math.cos(time * 0.3) * 0.2
    meshRef.current.rotation.y = Math.sin(time * 0.25) * 0.15
    meshRef.current.rotation.z = Math.cos(time * 0.2) * 0.08
    meshRef.current.rotation.x = Math.sin(time * 0.15) * 0.05
    
    // Pulsating engine glow
    if (glowRef.current) {
      glowRef.current.intensity = 2 + Math.sin(time * 3) * 0.5
    }
  })
  
  const isMobile = viewport.width < 10
  
  return (
    <group 
      ref={meshRef} 
      position={[isMobile ? 0 : 3.5, 0, 0]} 
      rotation={[0.2, -0.3, 0]}
      scale={isMobile ? 0.7 : 1}
    >
      {/* Main Fuselage */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[1, 3.5, 12]} />
        <meshStandardMaterial 
          color="#4a9eff" 
          metalness={0.9} 
          roughness={0.15}
          emissive="#2563eb"
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Left Wing */}
      <mesh position={[-1.2, -0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.4, 2, 0.08]} />
        <meshStandardMaterial 
          color="#60a5fa" 
          metalness={0.85} 
          roughness={0.2}
          emissive="#1d4ed8"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Right Wing */}
      <mesh position={[1.2, -0.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.4, 2, 0.08]} />
        <meshStandardMaterial 
          color="#60a5fa" 
          metalness={0.85} 
          roughness={0.2}
          emissive="#1d4ed8"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Tail Fins */}
      <mesh position={[0, -1.5, 0.4]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.6]} />
        <meshStandardMaterial 
          color="#93c5fd" 
          metalness={0.8} 
          roughness={0.25}
          emissive="#3b82f6"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Cockpit Glass */}
      <mesh position={[0, 1.2, 0.35]}>
        <sphereGeometry args={[0.5, 20, 20, 0, Math.PI]} />
        <meshPhysicalMaterial 
          color="#93c5fd" 
          metalness={0.95} 
          roughness={0.05}
          transparent
          opacity={0.7}
          emissive="#60a5fa"
          emissiveIntensity={0.6}
          transmission={0.3}
          thickness={0.5}
        />
      </mesh>
      
      {/* Cockpit Detail */}
      <mesh position={[0, 1.1, 0.5]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial 
          color="#1e3a8a" 
          metalness={0.5} 
          roughness={0.3}
        />
      </mesh>
      
      {/* Engine Nozzles */}
      <group position={[0, -1.8, 0]}>
        <mesh position={[-0.3, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.18, 0.4, 16]} />
          <meshStandardMaterial 
            color="#1e40af" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.18, 0.4, 16]} />
          <meshStandardMaterial 
            color="#1e40af" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
        
        {/* Engine Glow */}
        <mesh position={[-0.3, -0.15, 0]}>
          <cylinderGeometry args={[0.18, 0.12, 0.2, 16]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            emissive="#3b82f6"
            emissiveIntensity={2}
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh position={[0.3, -0.15, 0]}>
          <cylinderGeometry args={[0.18, 0.12, 0.2, 16]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            emissive="#3b82f6"
            emissiveIntensity={2}
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>
      
      {/* Engine Point Lights */}
      <pointLight 
        ref={glowRef}
        position={[0, -2, 0]} 
        intensity={2} 
        distance={8} 
        color="#3b82f6" 
        decay={2}
      />
      
      {/* Accent Lights */}
      <pointLight position={[0, 1.5, 0]} intensity={0.8} distance={3} color="#60a5fa" />
      <pointLight position={[-1.2, -0.3, 0]} intensity={0.5} distance={2} color="#1d4ed8" />
      <pointLight position={[1.2, -0.3, 0]} intensity={0.5} distance={2} color="#1d4ed8" />
    </group>
  )
}

// Enhanced Floating Particles with velocity
function Particles() {
  const count = 1500
  const particlesRef = useRef()
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60
      
      vel[i * 3] = (Math.random() - 0.5) * 0.02
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02
    }
    return [pos, vel]
  }, [])
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime
      particlesRef.current.rotation.y = time * 0.03
      particlesRef.current.rotation.x = Math.sin(time * 0.02) * 0.1
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08} 
        color="#60a5fa" 
        transparent 
        opacity={0.7}
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Nebula/Space Clouds Effect
function SpaceClouds() {
  const cloudsRef = useRef()
  
  const cloudGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const count = 500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const radius = 40 + Math.random() * 20
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      const color = new THREE.Color()
      color.setHSL(0.6 + Math.random() * 0.1, 0.8, 0.5)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geometry
  }, [])
  
  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = state.clock.elapsedTime * 0.01
    }
  })
  
  return (
    <points ref={cloudsRef} geometry={cloudGeometry}>
      <pointsMaterial 
        size={2} 
        vertexColors
        transparent 
        opacity={0.15}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Enhanced Scene with better lighting
function Scene() {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light (sun-like) */}
      <directionalLight position={[15, 10, 5]} intensity={1.2} color="#ffffff" />
      
      {/* Fill lights */}
      <pointLight position={[-15, -10, -5]} intensity={0.6} color="#3b82f6" />
      <pointLight position={[10, -15, 10]} intensity={0.5} color="#60a5fa" />
      
      {/* Rim light for spaceship */}
      <spotLight 
        position={[0, 5, -10]} 
        intensity={0.8} 
        angle={0.6} 
        penumbra={1}
        color="#93c5fd"
      />
      
      <AnimatedStars />
      <SpaceClouds />
      <Particles />
      <Spaceship />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 2.2}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}

// Main Component with performance optimizations
export default function SpaceshipBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 2, 12], fov: 50 }}
        style={{ 
          background: 'linear-gradient(to bottom, #0a0e27, #0f172a, #1e1b4b)',
        }}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
      
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
    </div>
  )
}
