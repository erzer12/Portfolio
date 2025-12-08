'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

export default function EventHorizonFooter() {
    return (
        <footer className="relative h-[50vh] bg-black flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <color attach="background" args={['#000000']} />
                    <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                    <BlackHole />
                </Canvas>
            </div>

            <div className="relative z-10 text-center space-y-8 pointer-events-none">
                <h2 className="text-4xl md:text-7xl font-playfair text-white mix-blend-difference">
                    Ready to Start?
                </h2>
                <p className="text-white/50 font-inter tracking-widest uppercase text-sm">
                    © 2025 Harshil P. All Systems Nominal.
                </p>
            </div>
        </footer>
    );
}

function BlackHole() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.z += 0.002;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, -2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3, 5, 64]} />
            <meshBasicMaterial
                color="#ffffff"
                side={THREE.DoubleSide}
                transparent
                opacity={0.1}
                blending={THREE.AdditiveBlending}
            />
            <mesh position={[0, 0, -0.1]}>
                <ringGeometry args={[2.8, 5.2, 64]} />
                <meshBasicMaterial color="#00ffff" side={THREE.DoubleSide} transparent opacity={0.05} blending={THREE.AdditiveBlending} />
            </mesh>
        </mesh>
    );
}
