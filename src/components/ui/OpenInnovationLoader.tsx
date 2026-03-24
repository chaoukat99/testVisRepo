import { Link, useNavigate } from 'react-router-dom';
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Float, Stars, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from "@/components/ui/Logo";

function TunnelParticles({ started, startTime }: { started: boolean, startTime: number }) {
    const count = 3000;
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Generate particles in a cylindrical/tunnel volume
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            // Random angle and radius for tunnel effect
            const theta = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 30; // Tunnel width

            const x = Math.cos(theta) * radius;
            const y = Math.sin(theta) * radius;
            const z = -100 + Math.random() * 100; // Deep depth

            temp.push({ x, y, z, originalZ: z, speed: 0.5 + Math.random() });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!mesh.current) return;

        let time = 0;
        let isWarping = false;

        if (started) {
            // Calculate time since start in seconds
            const now = Date.now();
            time = (now - startTime) / 1000;
            isWarping = time < 1.5;
        }

        // Idle speed vs Warp speed
        const baseSpeed = started ? 1 : 0.05; // Very slow when idle
        const warpMultiplier = isWarping ? 8 : 0.5;
        const currentMultiplier = started ? warpMultiplier : 1;

        particles.forEach((particle, i) => {
            // Move forward (+Z)
            particle.z += particle.speed * baseSpeed * currentMultiplier;

            // Loop particles back to far distance
            if (particle.z > 20) particle.z = -100;

            const zPos = particle.z;

            // "Warp stretching": Scale Z during high speed
            const scaleZ = isWarping && started ? 20 : 1;
            const scale = 1;

            dummy.position.set(particle.x, particle.y, zPos);
            dummy.scale.set(scale, scale, scaleZ);
            dummy.rotation.set(0, 0, 0); // Reset rotation
            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.03, 0]} />
            <meshBasicMaterial color="#e0f7fa" />
        </instancedMesh>
    );
}

function IconicAura() {
    const group = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (group.current) {
            group.current.rotation.z -= 0.005;
        }
    });

    return (
        <group ref={group} position={[0, 0, -5]}>
            {/* Center Glow */}
            <mesh>
                <planeGeometry args={[15, 15]} />
                <meshBasicMaterial
                    color="#06b6d4"
                    transparent
                    opacity={0.1}
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                // Create a radial gradient texture procedurally via shader or simplified map is complex here, 
                // sticking to basic transparent plane for soft glow
                />
            </mesh>
            {/* Ring 1 */}
            <mesh rotation={[0, 0, Math.PI / 4]}>
                <ringGeometry args={[6, 6.1, 64]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
            </mesh>
            {/* Ring 2 */}
            <mesh rotation={[0, 0, -Math.PI / 4]}>
                <ringGeometry args={[7, 7.05, 64]} />
                <meshBasicMaterial color="#0891b2" transparent opacity={0.2} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
}

function LogoWithAura({ successMode, onHome, onComplete }: { successMode?: boolean, onHome?: () => void, onComplete?: () => void }) {
    return (
        <group>
            {/* 3D Aura elements can go here if we want them locked to logo */}
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                <Html center zIndexRange={[100, 0]} transform>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.2, filter: "blur(20px)" }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            filter: "blur(0px)",
                        }}
                        transition={{
                            duration: 1.5,
                            delay: 1.0,
                            ease: [0.16, 1, 0.3, 1] // Quint like ease
                        }}
                        className="relative flex flex-col items-center justify-center p-8 w-[600px]"
                    >
                        {/* CSS Aura / Glow behind */}
                        <motion.div
                            animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute inset-0 bg-cyan-500/20 blur-[60px] rounded-full scale-150 z-[-1]"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2, duration: 1 }}
                            className="mb-8"
                        >
                            <Logo size="hero" className="brightness-125" />
                        </motion.div>

                        <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_60px_rgba(34,211,238,0.8)]"
                            style={{ fontFamily: "'Inter', sans-serif" }}>
                            OPENIN
                        </h1>
                        <h2 className="text-xl md:text-2xl font-light text-cyan-200 tracking-[1em] mt-0 uppercase opacity-90 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                            Partners
                        </h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.2, duration: 1, ease: "easeOut" }}
                            className="mt-8 flex flex-col items-center gap-4 text-center"
                        >
                            <div className="h-[1px] w-12 bg-cyan-400/50 mb-2" />

                            {successMode ? (
                                <div className="flex flex-col gap-6 items-center">
                                    <p className="text-sm md:text-base font-light text-cyan-50 tracking-[0.1em] max-w-lg leading-relaxed">
                                        Votre demande est enregistrée. <br />
                                        <span className="text-cyan-400 font-medium">L'administrateur valide votre dossier.</span> <br />
                                        Nous vous répondrons très bientôt.
                                    </p>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1, duration: 0.5 }}
                                    >
                                        <button
                                            onClick={onHome}
                                            className="px-8 py-3 mt-4 border border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400 font-light tracking-[0.2em] uppercase text-xs transition-all duration-300 rounded-sm backdrop-blur-md"
                                        >
                                            Retour à l'accueil
                                        </button>
                                    </motion.div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-6">
                                    <p className="text-[10px] md:text-xs font-light text-cyan-50/60 tracking-[0.4em] uppercase text-center max-w-lg px-4">
                                        Le Leader du Recrutement des Consultants de Qualité
                                    </p>

                                    {onComplete && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1.5, duration: 0.5 }}
                                        >
                                            <button
                                                onClick={onComplete}
                                                className="px-8 py-3 border border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400 font-light tracking-[0.2em] uppercase text-xs transition-all duration-300 rounded-sm backdrop-blur-md"
                                            >
                                                Entrer
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {!successMode && <div className="h-[1px] w-12 bg-cyan-400/50 mt-2" />}
                        </motion.div>
                    </motion.div>
                </Html>
            </Float>
        </group>
    );
}

const playIntroSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();

        // Resume if suspended (browser policy)
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const now = ctx.currentTime;

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.1, now);
        masterGain.gain.linearRampToValueAtTime(0.3, now + 1);
        masterGain.connect(ctx.destination);

        // 1. Warp / Engine Buildup
        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(50, now);
        osc1.frequency.exponentialRampToValueAtTime(800, now + 1.5);
        osc1.start(now);
        osc1.stop(now + 2.5);

        const gain1 = ctx.createGain();
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 2.0);
        osc1.connect(gain1);
        gain1.connect(masterGain);

        // 2. Whoosh
        const oscNoise = ctx.createOscillator();
        oscNoise.type = 'triangle';
        oscNoise.frequency.setValueAtTime(100, now);
        oscNoise.frequency.linearRampToValueAtTime(2000, now + 1.5);
        oscNoise.start(now);
        oscNoise.stop(now + 2);

        const gainNoise = ctx.createGain();
        gainNoise.gain.setValueAtTime(0.1, now);
        gainNoise.gain.linearRampToValueAtTime(0, now + 1.8);
        oscNoise.connect(gainNoise);
        gainNoise.connect(masterGain);

        // 3. Impact Chord
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + 1.4);
            osc.start(now + 1.4);
            osc.stop(now + 6);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, now + 1.4);
            gain.gain.linearRampToValueAtTime(0.1, now + 1.5);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 5);
            osc.connect(gain);
            gain.connect(masterGain);
        });

    } catch (e) {
        console.error("Audio play failed", e);
    }
};

export function OpenInnovationLoader({ className, autoStart = false, successMode = false, onComplete }: { className?: string, autoStart?: boolean, successMode?: boolean, onComplete?: () => void }) {
    // const navigate = useNavigate();
    const [started, setStarted] = React.useState(autoStart);
    const [startTime, setStartTime] = React.useState(autoStart ? Date.now() : 0);

    const handleStart = () => {
        setStarted(true);
        setStartTime(Date.now());
        playIntroSound();
    };

    React.useEffect(() => {
        if (autoStart) {
            playIntroSound();
        }
    }, [autoStart]);

    return (
        <div className={`w-full h-screen bg-[#000000] relative overflow-hidden ${className}`}>
            {/* Initial Flash */}
            {started && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.3, delay: 1.3, ease: "easeOut" }}
                    className="absolute inset-0 bg-cyan-100 z-50 pointer-events-none mix-blend-overlay"
                />
            )}

            {/* Start Button Overlay */}
            <AnimatePresence>
                {!started && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
                        onClick={handleStart}
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="px-8 py-3 border border-cyan-500 text-cyan-400 font-light tracking-[0.2em] uppercase text-sm hover:bg-cyan-500/10 transition-colors"
                        >
                            Initialize Sequence
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <color attach="background" args={['#000000']} />
                <fog attach="fog" args={['#000000', 0, 80]} />

                <IconicAura />
                <TunnelParticles started={started} startTime={startTime} />

                {started && <LogoWithAura successMode={successMode} onHome={() => {
                    sessionStorage.setItem('skipIntro', 'true');
                    window.location.href = '/';
                }} onComplete={onComplete} />}

                <Stars radius={150} depth={50} count={3000} factor={4} saturation={0} fade speed={started ? 2 : 0.2} />
            </Canvas>
        </div>
    );
}
