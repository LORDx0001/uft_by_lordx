import React, { useRef, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';
import { Center, Float, OrbitControls } from '@react-three/drei';

type ModelProps = {
    url: string;
};

const Model: React.FC<ModelProps> = ({ url }) => {
    const geom = useLoader(STLLoader, url);
    const meshRef = useRef<THREE.Mesh>(null);
    // Center the geometry
    useMemo(() => {
        if (geom) {
            geom.center();
            geom.computeVertexNormals();
            // -Math.PI / 2 is the standard rotation for STL files (Z-up) in Three.js (Y-up)
            geom.rotateX(-0.09)
        }
    }, [geom]);

    // Manual rotation removed in favor of OrbitControls

    return (
        <mesh ref={meshRef}> {/* Rotation removed, geometry is pre-rotated */}
            <primitive object={geom} attach="geometry" />
            <meshStandardMaterial
                color="#ffffff"
                metalness={0.5}
                roughness={0.2}
                emissive="#cccccc"
                emissiveIntensity={0.2}
            />
        </mesh>
    );
};

const Hero3DModel: React.FC = () => {
    const [autoRotate, setAutoRotate] = React.useState(true);

    // Calculate responsive camera position and FOV based on screen width
    // This ensures the model fits perfectly on 11", 13", 14", 15", 16", 17" and TV screens
    const getCameraSettings = () => {
        if (typeof window === 'undefined') return { position: [0, 0, 120] as [number, number, number], fov: 50 };
        const width = window.innerWidth;

        if (width < 640) return { position: [0, 0, 160] as [number, number, number], fov: 45 }; // Mobile
        if (width < 1024) return { position: [0, 0, 140] as [number, number, number], fov: 50 }; // Tablet
        if (width < 1440) return { position: [0, 0, 120] as [number, number, number], fov: 50 }; // Laptops (11-14")
        if (width < 1920) return { position: [0, 0, 110] as [number, number, number], fov: 55 }; // Desktops (15-17")
        return { position: [0, 0, 100] as [number, number, number], fov: 60 }; // 4K/TV
    };

    const { position, fov } = getCameraSettings();

    return (
        /* 
           POSITION ADJUSTMENT: 
           - Change 'translate-x-12' and '-mt-10' below to shift the model container.
           - w-[min(90vw,400px)] aspect-square ensures the model scales with the screen
        */
        <div className="w-[min(90vw,400px)] md:w-[min(45vw,600px)] aspect-square -mt-8 md:-mt-10 md:translate-x-6 lg:translate-x-12 animate-fade-in-up pointer-events-none md:pointer-events-auto"
            style={{ animationDuration: '2s', animationDelay: "0.4s", background: 'transparent' }}>
            <Canvas
                camera={{ position, fov }} // Responsive camera settings
                gl={{
                    alpha: true,
                    antialias: true,
                    preserveDrawingBuffer: false,
                    powerPreference: "high-performance"
                }}
                onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0); // Force absolute transparency
                }}
                style={{ background: 'transparent' }} // Ensure no background color on canvas
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[100, 100, 100]} intensity={1} />
                <pointLight position={[-100, -100, -100]} intensity={0.5} color="#00ffff" />

                <React.Suspense fallback={null}>
                    {/* POSITION ADJUSTMENT: position={[x, y, z]} below moves the model inside the canvas */}
                    <Center position={[0, 0, 0]}>
                        <Float speed={0.3} rotationIntensity={0.8} floatIntensity={3}>
                            <Model url="/models/logo_loader.stl" />
                        </Float>
                    </Center>
                </React.Suspense>

                <OrbitControls
                    enableZoom={false}
                    autoRotate={autoRotate}
                    autoRotateSpeed={2}
                    enablePan={false}
                    onStart={() => setAutoRotate(false)}
                />
            </Canvas>
        </div>
    );
};

export default Hero3DModel;
