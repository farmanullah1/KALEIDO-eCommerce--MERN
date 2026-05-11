import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, PerspectiveCamera, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ArtifactCore = ({ imageUrl }: { imageUrl: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = new THREE.TextureLoader().load(imageUrl);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial map={texture} roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* Holographic Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <MeshWobbleMaterial color="#00ffff" speed={2} factor={0.5} transparent opacity={0.5} />
      </mesh>
    </Float>
  );
};

const HologramPreview = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div className="w-full h-full relative">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />
        
        <ArtifactCore imageUrl={imageUrl} />
        
        <gridHelper args={[20, 20, 0x00ffff, 0x002222]} position={[0, -3, 0]} />
      </Canvas>
      
      {/* HUD Elements */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
        <div className="flex justify-between items-start">
          <div className="font-mono text-[10px] text-cyan animate-pulse">
            SCANNING ARTIFACT...<br />
            STRUCTURAL INTEGRITY: 99.8%<br />
            ORIGIN: UNKNOWN
          </div>
          <div className="w-12 h-12 border-t border-r border-cyan opacity-50" />
        </div>
        <div className="flex justify-between items-end">
          <div className="w-12 h-12 border-b border-l border-cyan opacity-50" />
          <div className="font-mono text-[10px] text-cyan/50 text-right uppercase tracking-widest">
            KALEIDO V.4.0<br />
            HOLOGRAPHIC RENDER
          </div>
        </div>
      </div>
    </div>
  );
};

export default HologramPreview;
