import { useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}

function ParticleField({ count = 150, mousePosition }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { viewport } = useThree();

  // Create particles
  const positionsArray = useRef<Float32Array>(new Float32Array(count * 3));
  const velocitiesArray = useRef<Float32Array>(new Float32Array(count * 3));

  useEffect(() => {
    const pos = positionsArray.current;
    const vel = velocitiesArray.current;
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
  }, [count]);

  // Create line geometry for connections
  const lineGeometry = useRef(new THREE.BufferGeometry()).current;
  const lineMaterial = useRef(
    new THREE.LineBasicMaterial({
      color: 0x7e6ee3,
      transparent: true,
      opacity: 0.15,
    })
  ).current;

  const updateLines = useCallback(() => {
    if (!meshRef.current) return;
    
    const positions = positionsArray.current;
    const linePositions: number[] = [];
    const connectionDistance = 2.5;
    const maxConnections = 3;
    
    for (let i = 0; i < count; i++) {
      let connections = 0;
      for (let j = i + 1; j < count; j++) {
        if (connections >= maxConnections) break;
        
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < connectionDistance) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
          connections++;
        }
      }
    }
    
    lineGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
  }, [count, lineGeometry]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const posArray = positionsArray.current;
    const velArray = velocitiesArray.current;
    const time = state.clock.elapsedTime;
    
    // Mouse influence in 3D space
    const mouseX = (mousePosition.current.x / window.innerWidth - 0.5) * viewport.width * 2;
    const mouseY = -(mousePosition.current.y / window.innerHeight - 0.5) * viewport.height * 2;
    
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      
      // Update position with velocity
      posArray[idx] += velArray[idx];
      posArray[idx + 1] += velArray[idx + 1];
      posArray[idx + 2] += velArray[idx + 2];
      
      // Add subtle wave motion
      posArray[idx + 1] += Math.sin(time * 0.5 + i * 0.1) * 0.002;
      
      // Mouse repulsion
      const dx = posArray[idx] - mouseX;
      const dy = posArray[idx + 1] - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 3) {
        const force = (3 - dist) * 0.02;
        posArray[idx] += (dx / dist) * force;
        posArray[idx + 1] += (dy / dist) * force;
      }
      
      // Boundary wrapping
      if (posArray[idx] > 10) posArray[idx] = -10;
      if (posArray[idx] < -10) posArray[idx] = 10;
      if (posArray[idx + 1] > 10) posArray[idx + 1] = -10;
      if (posArray[idx + 1] < -10) posArray[idx + 1] = 10;
    }
    
    const positionAttr = meshRef.current.geometry.attributes.position;
    if (positionAttr) {
      positionAttr.needsUpdate = true;
    }
    updateLines();
  });

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positionsArray.current, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#7e6ee3"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry} material={lineMaterial} />
    </>
  );
}

export function ParticleBackground() {
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField mousePosition={mousePosition} count={120} />
      </Canvas>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
}
