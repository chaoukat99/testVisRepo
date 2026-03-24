import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X, Sparkles, Zap, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export const NeuralGatewaySection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tunnelRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tunnel = tunnelRef.current;
        const content = contentRef.current;

        if (!tunnel || !content) return;

        // items to fly through
        const items = gsap.utils.toArray<HTMLElement>('.tunnel-item');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=300%", // Long scroll distance
                pin: true,
                scrub: 1,
                anticipatePin: 1
            }
        });

        // 1. Zoom through the tunnel items
        tl.to(items, {
            z: 1000,
            opacity: 0,
            stagger: {
                each: 0.5,
                from: "start" // Objects closest first? We simulate moving forward.
            },
            ease: "power2.in",
            duration: 5
        }, 0);

        // Animate opacity of items based on Z position simulation
        items.forEach((item, i) => {
            // Initial setup: positioned in "distance"
            gsap.set(item, {
                scale: 0.1 + (i * 0.05), // Further ones smaller? No, let's start them small and grow
                opacity: 0,
                z: 0
            });

            // Custom animation for visual "flyby"
            tl.fromTo(item,
                { scale: 0, opacity: 0, z: -1000 }, // Start far away
                {
                    scale: 2, opacity: 1, z: 500, duration: 2, ease: "none",
                    immediateRender: false // Important for timeline placement
                },
                i * 1.5 // Stagger start time
            );
            // Fade out as it passes camera
            tl.to(item, { opacity: 0, duration: 0.5 }, i * 1.5 + 1.5);
        });

        // 2. Final Content Review
        // As the tunnel ends, the final CTA content fades in
        tl.fromTo(content,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 2 },
            "-=1" // Overlap with last items
        );

        // Background Warp speed effect
        gsap.to(".warp-star", {
            z: 1000,
            ease: "none",
            repeat: -1,
            duration: 2,
            stagger: {
                amount: 5,
                from: "random"
            }
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative h-[100vh] bg-black overflow-hidden perspective-tunnel">
            {/* CSS for perspective */}
            <style>{`
                .perspective-tunnel {
                    perspective: 1000px;
                }
                .tunnel-item {
                    transform-style: preserve-3d;
                }
            `}</style>

            {/* Background Stars / Grid */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#000000_100%)]" />
                {/* Simulated stars */}
                {Array.from({ length: 50 }).map((_, i) => (
                    <div
                        key={i}
                        className="warp-star absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            transform: `translateZ(-${Math.random() * 1000}px)`
                        }}
                    ></div>
                ))}
            </div>

            {/* Tunnel Container */}
            <div ref={tunnelRef} className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">

                {/* 1. Old Way - Left */}
                <div className="tunnel-item absolute flex flex-col items-center p-6 bg-red-500/10 border border-red-500/30 backdrop-blur-md rounded-xl transform -translate-x-64">
                    <X className="w-12 h-12 text-red-500 mb-2" />
                    <span className="text-red-200 font-bold text-xl">CV Papiers</span>
                </div>

                {/* 1. Old Way - Right */}
                <div className="tunnel-item absolute flex flex-col items-center p-6 bg-red-500/10 border border-red-500/30 backdrop-blur-md rounded-xl transform translate-x-64 translate-y-20">
                    <X className="w-12 h-12 text-red-500 mb-2" />
                    <span className="text-red-200 font-bold text-xl">Attente Infinie</span>
                </div>

                {/* 2. Transition - Center */}
                <div className="tunnel-item absolute flex flex-col items-center p-8 bg-blue-500/10 border border-blue-500/30 backdrop-blur-md rounded-2xl">
                    <Sparkles className="w-16 h-16 text-blue-400 mb-4 animate-spin-slow" />
                    <span className="text-blue-200 font-bold text-2xl">Analyse IA</span>
                </div>

                {/* 3. New Way - Left */}
                <div className="tunnel-item absolute flex flex-col items-center p-6 bg-green-500/10 border border-green-500/30 backdrop-blur-md rounded-xl transform -translate-x-48 -translate-y-20">
                    <Check className="w-12 h-12 text-green-500 mb-2" />
                    <span className="text-green-200 font-bold text-xl">Match Instantané</span>
                </div>

                {/* 3. Result - Right */}
                <div className="tunnel-item absolute flex flex-col items-center p-6 bg-purple-500/10 border border-purple-500/30 backdrop-blur-md rounded-xl transform translate-x-48">
                    <Rocket className="w-12 h-12 text-purple-500 mb-2" />
                    <span className="text-purple-200 font-bold text-xl">Carrière Propulsée</span>
                </div>

            </div>

            {/* Final Content (Appears at end) */}
            <div ref={contentRef} className="relative z-20 container h-full flex flex-col items-center justify-center opacity-0">
                <div className="text-center space-y-8 max-w-4xl p-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(59,130,246,0.3)]">
                    <Zap className="w-16 h-16 text-yellow-400 mx-auto fill-yellow-400/20" />

                    <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                        L'Avenir du Recrutement<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            Est Entre Vos Mains
                        </span>
                    </h2>

                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Ne laissez plus le hasard décider de votre carrière. Rejoignez l'écosystème où l'intelligence artificielle travaille pour votre succès.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                        <Button variant="hero" size="xl" className="text-lg px-10 h-16 shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] transition-all duration-500" asChild>
                            <Link to="/company-register">
                                Commencer Maintenant <ArrowRight className="ml-2 w-6 h-6" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

        </section>
    );
};
