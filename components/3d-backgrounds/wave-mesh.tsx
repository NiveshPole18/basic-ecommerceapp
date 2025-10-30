"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function WaveMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(10, 10, 100, 100)
    return geo
  }, [])

  useFrame(() => {
    if (meshRef.current && meshRef.current.geometry) {
      timeRef.current += 0.01
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array
      const originalPositions = geometry.attributes.position.array as Float32Array

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] = originalPositions[i + 2] + Math.sin(originalPositions[i] * 0.5 + timeRef.current) * 0.3
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, 0]}>
      <meshStandardMaterial
        color="#06b6d4"
        metalness={0.6}
        roughness={0.4}
        wireframe={false}
        emissive="#0891b2"
        emissiveIntensity={0.1}
      />
    </mesh>
  )
}

export function WaveMeshBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 2, 5] }}>
        <WaveMesh />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
      </Canvas>
    </div>
  )
}
