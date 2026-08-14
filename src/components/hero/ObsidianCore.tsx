import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import type { Group, Mesh } from "three";

function Core() {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const pointer = useThree((s) => s.pointer);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.08;
      meshRef.current.rotation.y += delta * 0.14;
    }
    if (groupRef.current) {
      // Gentle pointer-parallax — the core leans toward the cursor without ever fully tracking it.
      groupRef.current.rotation.y += (pointer.x * 0.4 - groupRef.current.rotation.y) * 0.04;
      groupRef.current.rotation.x += (-pointer.y * 0.25 - groupRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.6, 1]} />
          <MeshTransmissionMaterial
            thickness={0.6}
            roughness={0.12}
            transmission={1}
            ior={1.4}
            chromaticAberration={0.02}
            color="#c8a24c"
            attenuationColor="#3a2a10"
            attenuationDistance={1.2}
            distortion={0.15}
            temporalDistortion={0.05}
          />
        </mesh>
      </Float>
      <Sparkles count={40} scale={4.2} size={2.4} speed={0.3} color="#e8d08a" opacity={0.6} />
    </group>
  );
}

/** Slowly rotating faceted obsidian/gold solid for the hero, with pointer-parallax lean and ambient sparkle. Lazy-loaded by the caller. */
export default function ObsidianCore() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 5]} intensity={40} color="#e8d08a" />
      <pointLight position={[-4, -2, -3]} intensity={20} color="#c8a24c" />
      <Core />
      <Environment preset="city" environmentIntensity={0.6} />
    </Canvas>
  );
}
