import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

const Scene = () => {
  const { theme } = useTheme();
  
  const meshGroup = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const gridRef = useRef<THREE.GridHelper>(null);
  
  const meshData = useMemo(() => {
    const baseGeos = [
      new THREE.OctahedronGeometry(0.5, 0),
      new THREE.TetrahedronGeometry(0.6, 0),
      new THREE.IcosahedronGeometry(0.4, 0),
      new THREE.OctahedronGeometry(0.3, 0),
      new THREE.TetrahedronGeometry(0.35, 0),
      new THREE.IcosahedronGeometry(0.6, 0),
      new THREE.OctahedronGeometry(0.45, 1)
    ];
    
    // Create 20 shapes instead of 7 for a fuller look
    const geos = [];
    for (let i = 0; i < 20; i++) {
      geos.push(baseGeos[i % baseGeos.length]);
    }
    
    return geos.map((geo) => {
      // Narrower X spread on mobile so they don't go off-screen
      const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
      const xSpread = isMobile ? 8 : 18;
      const ySpread = isMobile ? 12 : 10;

      const x = (Math.random() - 0.5) * xSpread;
      const y = (Math.random() - 0.5) * ySpread;
      const z = (Math.random() - 0.5) * 10;
      
      const speed = 0.2 + Math.random() * 0.4;
      const offset = Math.random() * Math.PI * 2;
      const ry = 0.002 + Math.random() * 0.008;
      const rx = 0.002 + Math.random() * 0.005;
      
      return { geo, pos: [x, y, z] as [number, number, number], speed, offset, rx, ry };
    });
  }, []);

  const particlesPositions = useMemo(() => {
    // Increased particle count from 300 to 500 and spread them over a wider area
    const positions = new Float32Array(500 * 3);
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const xSpread = isMobile ? 10 : 20;
    const ySpread = isMobile ? 16 : 12;

    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * xSpread; // width spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * ySpread; // height spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // depth spread
    }
    return positions;
  }, []);

  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ cMX: 0, cMY: 0 });
  const tRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { camera } = useThree();

  useEffect(() => {
    if (gridRef.current) {
      const mat = gridRef.current.material as THREE.Material;
      mat.opacity = 0.08;
      mat.transparent = true;
    }
  }, []);

  useFrame(() => {
    tRef.current += 0.01;
    const t = tRef.current;

    const tMX = mouseRef.current.x;
    const tMY = mouseRef.current.y;
    targetRef.current.cMX += (tMX - targetRef.current.cMX) * 0.04;
    targetRef.current.cMY += (tMY - targetRef.current.cMY) * 0.04;

    camera.position.x = targetRef.current.cMX * 0.5;
    camera.position.y = targetRef.current.cMY * 0.3;
    camera.lookAt(0, 0, 0);

    if (meshGroup.current) {
      meshGroup.current.children.forEach((m, i) => {
        const data = meshData[i];
        m.rotation.x += data.rx;
        m.rotation.y += data.ry;
        m.position.y += Math.sin(t * data.speed + data.offset) * 0.003;
      });
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
      particlesRef.current.rotation.x += 0.0002;
    }

    if (gridRef.current) {
      gridRef.current.position.y = -3 + Math.sin(t * 0.3) * 0.1;
    }
  });

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const color = isDark ? "#0756B1" : "#1a7ae8";

  return (
    <>
      <group ref={meshGroup}>
        {meshData.map((data, i) => (
          <mesh key={i} geometry={data.geo} position={data.pos}>
            <meshBasicMaterial color={color} wireframe transparent opacity={0.4} />
          </mesh>
        ))}
      </group>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particlesPositions}
            count={particlesPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.04} transparent opacity={0.6} />
      </points>

      <gridHelper ref={gridRef} args={[20, 30, color, color]} position={[0, -3, 0]} />
    </>
  );
};

export const Background3D = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-background transition-colors duration-500">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true, antialias: true }}>
        <Scene />
      </Canvas>
    </div>
  );
};
