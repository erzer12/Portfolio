'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

function ImagePlane() {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);
    const texture = useTexture('/hero-portrait.png');

    useFrame((state) => {
        if (!meshRef.current) return;

        // Mouse interaction for tilt
        const { x, y } = state.mouse;
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -y * 0.2, 0.1);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x * 0.2, 0.1);

        // Hover effect (scale)
        const targetScale = hovered ? 1.05 : 1;
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale * 4, 0.1);
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale * 5, 0.1);
    });

    return (
        <mesh
            ref={meshRef}
            scale={[4, 5, 1]}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <planeGeometry args={[1, 1, 32, 32]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    );
}

export default function InteractivePortrait() {
    return (
        <div className="w-full h-[80vh] relative">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ImagePlane />
            </Canvas>
        </div>
    );
}
