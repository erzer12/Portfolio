'use client';

import React, { useMemo, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, Text, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';


import { useExperience, useEducation, Experience } from '@/hooks/use-data';

export default function TimeWarpExperience() {
    const { experience } = useExperience();
    const { education } = useEducation();

    return (
        <section className="h-[60vh] w-full bg-black">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]}>
                <color attach="background" args={['#000000']} />
                <fog attach="fog" args={['#000000', 5, 20]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

                <Suspense fallback={null}>
                    <ScrollControls pages={(experience.length + education.length + 1) * 0.6} damping={0.2}>
                        <ExperienceTunnel experience={experience} education={education} />
                    </ScrollControls>
                </Suspense>
            </Canvas>
        </section>
    );
}

function ExperienceTunnel({ experience, education }: { experience: Experience[], education: any[] }) {
    const scroll = useScroll();
    const curve = useMemo(() => {
        const points = [];
        // Generate a winding path
        for (let i = 0; i < 50; i++) {
            points.push(new THREE.Vector3(
                Math.sin(i * 0.5) * 5,
                Math.cos(i * 0.3) * 5,
                -i * 10
            ));
        }
        return new THREE.CatmullRomCurve3(points);
    }, []);

    // Combine dynamic work and education for the timeline
    const timelineItems = useMemo(() => [
        ...experience.map(item => ({ ...item, type: 'work', date: `${item.start} - ${item.end}` })),
        ...education.map(item => ({ ...item, type: 'education', date: item.year }))
    ], [experience, education]);

    return (
        <>
            {/* The Tunnel Mesh */}
            <mesh>
                <tubeGeometry args={[curve, 100, 2, 8, false]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    wireframe
                    side={THREE.DoubleSide}
                    emissive="#444"
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* Floating Items along the path */}
            {timelineItems.map((item, index) => {
                // Position items along the curve
                const t = (index + 1) / (timelineItems.length + 2);
                const pos = curve.getPoint(t);

                return (
                    <Float key={index} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        <group position={pos} rotation={[0, 0, 0]}>
                            {/* Text Content */}
                            <Text
                                position={[2, 1, 0]}
                                fontSize={0.5}
                                color="white"
                                anchorX="left"
                                anchorY="middle"
                                font="/fonts/Inter-Bold.ttf" // Assuming font exists or fallback
                            >
                                {(item as any).role || (item as any).degree}
                            </Text>
                            <Text
                                position={[2, 0.4, 0]}
                                fontSize={0.3}
                                color="#888"
                                anchorX="left"
                                anchorY="middle"
                            >
                                {(item as any).company || (item as any).school}
                            </Text>
                            <Text
                                position={[2, -0.2, 0]}
                                fontSize={0.25}
                                color="#666"
                                anchorX="left"
                                anchorY="middle"
                            >
                                {(item as any).date || (item as any).year}
                            </Text>

                            {/* Marker Orb */}
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[0.3, 32, 32]} />
                                <meshStandardMaterial color={item.type === 'work' ? '#00ff88' : '#0088ff'} emissive={item.type === 'work' ? '#00ff88' : '#0088ff'} emissiveIntensity={2} />
                            </mesh>
                        </group>
                    </Float>
                );
            })}

            <CameraRig curve={curve} scroll={scroll} />
        </>
    );
}

function CameraRig({ curve, scroll }: { curve: THREE.CatmullRomCurve3, scroll: any }) {
    const vec = useMemo(() => new THREE.Vector3(), []);
    const lookAtVec = useMemo(() => new THREE.Vector3(), []);

    useFrame((state) => {
        const t = scroll.offset; // 0 to 1

        // Calculate position on curve based on scroll
        // We map scroll 0-1 to a segment of the curve
        curve.getPoint(t * 0.9, vec); // Don't go all the way to end to avoid clipping
        curve.getPoint(Math.min(t * 0.9 + 0.1, 1), lookAtVec);

        state.camera.position.lerp(vec, 0.1);
        state.camera.lookAt(lookAtVec);
    });
    return null;
}
