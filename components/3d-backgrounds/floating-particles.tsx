"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import type * as THREE from "three"

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const particlesRef = useRef<Float32Array | null>(null)

  useEffect(() => {
    const count = 500
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10
      positions[i + 1] = (Math.random() - 0.5) * 10
      positions[i + 2] = (Math.random() - 0.5) * 10
    }
    particlesRef.current = positions
  }, [])

  useFrame(() => {
    if (pointsRef.current && particlesRef.current) {
      pointsRef.current.rotation.x += 0.0001
      pointsRef.current.rotation.y += 0.0002
    }
  })

  return (
    <Points ref={pointsRef} positions={particlesRef.current || []}>
      <PointMaterial transparent color="#a78bfa" size={0.05} sizeAttenuation={true} depthWrite={false} />
    </Points>
  )
}

export function FloatingParticlesBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ParticleField />
        <ambientLight intensity={0.3} />
      </Canvas>
    </div>
  )
}
