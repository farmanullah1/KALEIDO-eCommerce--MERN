import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PerspectiveCamera, Text, Image as DreiImage } from '@react-three/drei';
import * as THREE from 'three';

interface Product {
  id: string;
  name: string;
  image: string;
}

const ProductCard = ({ product, index, total, activeIndex, onClick }: { 
  product: Product; 
  index: number; 
  total: number; 
  activeIndex: number;
  onClick: (index: number) => void;
}) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // Calculate position on a circle
  const angle = (index / total) * Math.PI * 2;
  const radius = 5;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Smooth rotation towards the viewer
    const targetRotation = (index - activeIndex) * (Math.PI * 2 / total);
    // Actually we want the group to rotate, but let's just make the cards face the center
    meshRef.current.lookAt(0, 0, 0);
    
    // Add some hover float
    if (index === activeIndex) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group 
      ref={meshRef} 
      position={[x, 0, z]} 
      onClick={() => onClick(index)}
    >
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh>
          <planeGeometry args={[2, 3]} />
          <meshStandardMaterial 
            color="#1A1A1A" 
            transparent 
            opacity={0.8} 
            metalness={0.8} 
            roughness={0.2} 
          />
          <DreiImage 
            url={product.image} 
            transparent 
            opacity={index === activeIndex ? 1 : 0.5} 
            scale={[1.8, 2.8]}
            position={[0, 0, 0.01]}
          />
        </mesh>
        
        {index === activeIndex && (
          <Text
            position={[0, -1.8, 0]}
            fontSize={0.2}
            color="#00F5FF"
            font="https://fonts.gstatic.com/s/syne/v18/8vIK7w8mO_v9i24E_mS_.woff"
          >
            {product.name.toUpperCase()}
          </Text>
        )}
      </Float>
      
      {/* Glow effect behind active card */}
      {index === activeIndex && (
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[2.5, 3.5]} />
          <MeshDistortMaterial
            color="#00F5FF"
            speed={2}
            distort={0.4}
            radius={1}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
    </group>
  );
};

export const PortalCarousel = ({ products }: { products: Product[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Smoothly rotate the entire carousel to the active index
    const targetRotation = -activeIndex * (Math.PI * 2 / products.length);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation,
      delta * 4
    );
  });

  return (
    <group ref={groupRef}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          total={products.length}
          activeIndex={activeIndex}
          onClick={setActiveIndex}
        />
      ))}
    </group>
  );
};

export const Scene = ({ products }: { products: Product[] }) => {
  return (
    <div className="w-full h-[600px] relative cursor-grab active:cursor-grabbing">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00F5FF" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#FF00F5" />
        
        <PortalCarousel products={products} />
        
        {/* Environment / Background effects */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#050505" 
            metalness={0.9} 
            roughness={0.1} 
          />
        </mesh>
        
        <fog attach="fog" args={['#0A0A0A', 5, 20]} />
      </Canvas>
    </div>
  );
};
