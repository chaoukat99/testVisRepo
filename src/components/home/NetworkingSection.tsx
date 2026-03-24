
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User, Briefcase, Code, Database, Globe, Cpu } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const nodes = [
    { icon: User, label: "Talents", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { icon: Briefcase, label: "Entreprises", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    { icon: Code, label: "Compétences", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
    { icon: Database, label: "Données", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
    { icon: Globe, label: "Global", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30" },
];

export const NetworkingSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const coreRef = useRef<HTMLDivElement>(null);
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const packetRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        const core = coreRef.current;

        // Initial State
        gsap.set(nodeRefs.current, { autoAlpha: 0, scale: 0 });
        gsap.set(core, { scale: 0, autoAlpha: 0 });
        gsap.set(packetRefs.current, { autoAlpha: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top center",
                end: "bottom center",
                toggleActions: "play reverse play reverse",
            }
        });

        // Animate Core
        tl.to(core, {
            duration: 1,
            scale: 1,
            autoAlpha: 1,
            ease: "elastic.out(1, 0.5)"
        });

        // Pulse Effect for Core
        gsap.to(core, {
            boxShadow: "0 0 40px 10px rgba(139, 92, 246, 0.3)",
            repeat: -1,
            yoyo: true,
            duration: 2,
            ease: "sine.inOut"
        });

        // Animate Nodes orbit and appearance
        nodeRefs.current.forEach((node, i) => {
            if (!node) return;

            const angle = (i / nodes.length) * Math.PI * 2;
            const radius = 250; // Distance from center
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            // Appear
            tl.to(node, {
                duration: 0.8,
                scale: 1,
                autoAlpha: 1,
                x: x,
                y: y,
                ease: "back.out(1.7)",
            }, "-=0.6");

            // Float/Wiggle
            gsap.to(node, {
                x: x + (Math.random() * 20 - 10),
                y: y + (Math.random() * 20 - 10),
                rotation: Math.random() * 10 - 5,
                duration: 2 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: Math.random()
            });
        });

        // Animate Data Packets - continuous flow from orbit to center
        nodeRefs.current.forEach((node, i) => {
            // Correct way to target the packets: filter by dataset owner
            // BUT, filtering refs array is tricky if order isn't guaranteed or if we push duplicates.
            // Better: select by class or just iterate all packets and check owner.
        });

    }, { scope: containerRef });

    // Separate effect for continuous data flow
    useGSAP(() => {
        // We need to wait for elements to be rendered and refs to be populated.
        // The previous useGSAP might run before refs are fully stable if we are not careful,
        // but usually in React useEffect/useGSAP runs after commit.

        // Let's filter packets based on their owner index
        const packets = packetRefs.current.filter(p => p !== null);

        packets.forEach((packet) => {
            if (!packet) return;
            const ownerIndex = parseInt(packet.dataset.owner || "0");

            const angle = (ownerIndex / nodes.length) * Math.PI * 2;
            const radius = 250;
            const startX = Math.cos(angle) * radius;
            const startY = Math.sin(angle) * radius;

            // Randomize start time
            const delay = Math.random() * 2;

            gsap.fromTo(packet,
                { x: startX, y: startY, autoAlpha: 0, scale: 0.5 },
                {
                    x: 0,
                    y: 0,
                    autoAlpha: 1,
                    scale: 0, // Shrink as it hits the core
                    duration: 1.5 + Math.random(), // Random speed
                    repeat: -1,
                    ease: "power1.in", // Accelerate towards center
                    delay: delay,
                }
            );
        });

    }, { scope: containerRef });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current || !coreRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        gsap.to(coreRef.current, {
            x: x * 30, // Move core slightly
            y: y * 30,
            duration: 1,
            ease: "power2.out"
        });

        // Move rings in opposite direction for depth
        gsap.to(".network-ring", {
            x: x * -20,
            y: y * -20,
            duration: 1.5,
            ease: "power2.out"
        });
    };

    return (
        <section ref={containerRef} onMouseMove={handleMouseMove} className="relative py-32 min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-background/50">

            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-950/20 to-background" />

            <div className="container relative z-10 flex flex-col items-center justify-center h-full">

                <div className="text-center mb-20 relative z-20">
                    <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4 animate-pulse">
                        Réseau de Talents Neuronal
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Notre IA traite en continu des millions de points de données pour créer des synergies parfaites entre talent et opportunité.
                    </p>
                </div>

                <div className="relative w-full max-w-3xl h-[600px] flex items-center justify-center perspective-1000">
                    {/* Connecting Lines SVG Layer */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 network-ring">
                        <circle cx="50%" cy="50%" r="250" fill="none" stroke="currentColor" strokeWidth="1" className="text-purple-500/30 animate-spin-slow" style={{ transformOrigin: "center" }} />
                        <circle cx="50%" cy="50%" r="180" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-500/30 animate-reverse-spin" style={{ transformOrigin: "center" }} />
                        <circle cx="50%" cy="50%" r="350" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/10" />
                    </svg>

                    {/* Core Node */}
                    <div
                        ref={coreRef}
                        className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/20 glass-morphism border border-white/20"
                    >
                        <Cpu className="w-16 h-16 text-white animate-pulse" />
                        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-20" />
                    </div>

                    {/* Data Packets Container */}
                    {nodes.map((_, i) => (
                        <div key={`packets-${i}`} className="absolute inset-0 pointer-events-none">
                            {[0, 1, 2].map(j => (
                                <div
                                    key={j}
                                    ref={el => { if (el) packetRefs.current.push(el) }}
                                    data-owner={i}
                                    className="absolute left-1/2 top-1/2 -ml-1 -mt-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan] z-0"
                                />
                            ))}
                        </div>
                    ))}

                    {/* Orbiting Nodes */}
                    {nodes.map((node, i) => (
                        <div
                            key={i}
                            ref={(el) => (nodeRefs.current[i] = el)}
                            className={`absolute left-1/2 top-1/2 -ml-12 -mt-12 w-24 h-24 rounded-2xl ${node.bg} ${node.border} border backdrop-blur-md flex flex-col items-center justify-center gap-2 shadow-lg transition-colors hover:shadow-cyan-500/20 cursor-pointer group`}
                        >
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                            <node.icon className={`w-8 h-8 ${node.color} group-hover:scale-110 transition-transform`} />
                            <span className={`text-xs font-semibold ${node.color}`}>{node.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
