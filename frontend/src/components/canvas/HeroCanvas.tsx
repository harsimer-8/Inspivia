"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Torus, Octahedron, Icosahedron, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface SculptureProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

function AbstractSculpture({ mouse }: SculptureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const orbitalNodes = useMemo(() => {
    return [
      { pos: [2.4, 1.2, -0.6] as [number, number, number], color: "#D3968C", scale: 0.22 },
      { pos: [-2.5, -1.1, 0.5] as [number, number, number], color: "#839958", scale: 0.28 },
      { pos: [1.8, -1.6, 1.0] as [number, number, number], color: "#F7F4D5", scale: 0.15 },
      { pos: [-1.9, 1.7, -0.4] as [number, number, number], color: "#105666", scale: 0.26 },
    ];
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Smooth cursor parallax tilt
      const targetRotY = mouse.current.x * 0.4 + t * 0.1;
      const targetRotX = -mouse.current.y * 0.3 + Math.sin(t * 0.3) * 0.08;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        delta * 3
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        delta * 3
      );
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.15;
      outerRingRef.current.rotation.x = Math.sin(t * 0.35) * 0.3;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= delta * 0.22;
      innerRingRef.current.rotation.z = Math.cos(t * 0.3) * 0.35;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <group ref={groupRef} position={[0.8, 0, 0]}>
      {/* Central Core: Icosahedron distorted mesh in Midnight Green */}
      <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.5}>
        <Icosahedron ref={coreRef} args={[1.3, 3]}>
          <MeshDistortMaterial
            color="#105666"
            emissive="#0A3323"
            emissiveIntensity={0.35}
            roughness={0.25}
            metalness={0.7}
            distort={0.25}
            speed={1.6}
          />
        </Icosahedron>
      </Float>

      {/* Outer Torus Ring in Rosy Brown */}
      <Torus ref={outerRingRef} args={[2.2, 0.03, 24, 100]} rotation={[1.1, 0.3, 0]}>
        <meshStandardMaterial
          color="#D3968C"
          roughness={0.2}
          metalness={0.85}
        />
      </Torus>

      {/* Inner Tilted Ring in Moss Green */}
      <Torus ref={innerRingRef} args={[1.8, 0.04, 24, 90]} rotation={[-0.8, 0.6, 0.2]}>
        <meshStandardMaterial
          color="#839958"
          roughness={0.25}
          metalness={0.75}
        />
      </Torus>

      {/* Floating Satellites */}
      {orbitalNodes.map((node, idx) => (
        <Float key={idx} speed={1.8 + idx * 0.3} floatIntensity={0.6}>
          <Octahedron args={[node.scale, 0]} position={node.pos}>
            <meshStandardMaterial
              color={node.color}
              roughness={0.2}
              metalness={0.8}
            />
          </Octahedron>
        </Float>
      ))}
    </group>
  );
}

// Fallback procedural visual in case WebGL is unavailable or during SSR
function CanvasFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
      <div className="relative w-72 h-72 rounded-full border border-rosy-brown/30 animate-spin-slow flex items-center justify-center">
        <div className="w-56 h-56 rounded-full border border-dashed border-moss-green/40 animate-pulse-subtle flex items-center justify-center">
          <div className="w-36 h-36 rounded-full bg-midnight-green/30 blur-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function HeroCanvas() {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);

    // Test WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted || !hasWebGL) {
    return <CanvasFallback />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 8, 5]} intensity={1.5} color="#F7F4D5" />
        <pointLight position={[-5, -4, -2]} intensity={0.8} color="#D3968C" />
        <pointLight position={[3, -3, 2]} intensity={0.9} color="#839958" />
        <AbstractSculpture mouse={mouse} />
      </Canvas>
    </div>
  );
}
