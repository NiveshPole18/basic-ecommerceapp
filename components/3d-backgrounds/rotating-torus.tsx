"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Torus, Environment } from "@react-three/drei"
import type * as THREE from "three"

function RotatingTorus() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <Torus ref={meshRef} args={[1, 0.4, 64, 100]}>
      <meshStandardMaterial
        color="#ec4899"
        metalness={0.7}
        roughness={0.3}
        emissive="#be185d"
        emissiveIntensity={0.2}
      />
    </Torus>
  )
}

export function RotatingTorusBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <RotatingTorus />
        <Environment preset="sunset" />
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} />
      </Canvas>
    </div>
  )
}
