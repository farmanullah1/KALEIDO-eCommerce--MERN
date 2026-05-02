import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Image, Environment, Text, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const ArtifactCard = ({ url, position, rotation, title }) => {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.position.y = Math.sin(time + position[0]) * 0.1;
      mesh.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh 
          ref={mesh} 
          onPointerOver={() => setHover(true)} 
          onPointerOut={() => setHover(false)}
        >
          <planeGeometry args={[2.5, 3.5]} />
          {/* Using a simpler material for better compatibility */}
          <meshStandardMaterial 
            color="#1a1f2b" 
            transparent 
            opacity={0.6} 
            metalness={0.8} 
            roughness={0.2} 
          />
          <Image 
            url={url} 
            transparent 
            opacity={hovered ? 1 : 0.8} 
            scale={[2.3, 3.3]} 
            position={[0, 0, 0.01]} 
          />
          {/* Rim light effect */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[2.55, 3.55]} />
            <meshBasicMaterial color={hovered ? "#00ecfb" : "#f5a97f"} transparent opacity={0.2} />
          </mesh>
        </mesh>
      </Float>
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
    </group>
  );
};

const PortalCarousel = () => {
  const products = useMemo(() => [
    { url: '/assets/artifact1.png', title: 'CORAL EMBER SHARD', position: [-4, 0, 0] },
    { url: '/assets/artifact2.png', title: 'CYBERNETIC PRISM', position: [0, 0, 2] },
    { url: '/assets/artifact3.png', title: 'OBSIDIAN SPHERE', position: [4, 0, 0] },
  ], []);

  return (
    <div className="w-full h-[600px] relative">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0e131f');
        }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#f5a97f" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00ecfb" />
        
        <group position={[0, 0.5, 0]}>
          {products.map((p, i) => (
            <ArtifactCard 
              key={i} 
              url={p.url} 
              title={p.title} 
              position={p.position} 
              rotation={[0, 0, 0]} 
            />
          ))}
        </group>

        {/* Realistic shadows instead of heavy reflector */}
        <ContactShadows 
          position={[0, -3.5, 0]} 
          opacity={0.4} 
          scale={20} 
          blur={2} 
          far={4.5} 
        />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default PortalCarousel;
