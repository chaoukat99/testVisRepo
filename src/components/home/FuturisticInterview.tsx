import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Brain, ScanFace, Activity, Fingerprint, Cpu, MessageSquare, Mic, Wifi } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

gsap.registerPlugin(useGSAP);

export const FuturisticInterview = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const coreRef = useRef<HTMLDivElement>(null);
    const [analyzing, setAnalyzing] = useState(true);

    useGSAP(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play reverse play reverse",
            },
        });

        // Initial Chaos to Order Animation
        tl.from(".holo-shard", {
            duration: 1.5,
            opacity: 0,
            scale: 0,
            x: () => (Math.random() - 0.5) * 500,
            y: () => (Math.random() - 0.5) * 500,
            rotation: () => Math.random() * 360,
            ease: "power4.out",
            stagger: 0.05,
        })
            .to(".connect-line", {
                duration: 1,
                opacity: 0.6,
                strokeDashoffset: 0,
                ease: "power2.inOut",
                stagger: 0.1,
            }, "-=1");

        // Continuous Core Pulse
        gsap.to(coreRef.current, {
            scale: 1.1,
            boxShadow: "0 0 50px rgba(0, 255, 255, 0.6), inset 0 0 30px rgba(0, 255, 255, 0.4)",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // Floating UI Elements
        gsap.to(".floating-panel", {
            y: 15,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: {
                each: 0.5,
                from: "random",
            },
        });

        // Scanner Effect
        gsap.to(".scan-line", {
            top: "100%",
            duration: 2,
            repeat: -1,
            ease: "linear",
        });

        // Text decoding/typing effect simulation
        const codeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
        const decodeText = (selector: string) => {
            if (!containerRef.current) return;
            const elements = containerRef.current.querySelectorAll(selector);
            elements.forEach((el) => {
                const originalText = el.textContent || "";
                let iterations = 0;
                const interval = setInterval(() => {
                    el.textContent = originalText
                        .split("")
                        .map((letter, index) => {
                            if (index < iterations) {
                                return originalText[index];
                            }
                            return codeChars[Math.floor(Math.random() * codeChars.length)];
                        })
                        .join("");

                    if (iterations >= originalText.length) {
                        clearInterval(interval);
                    }
                    iterations += 1 / 3;
                }, 30);
            });
        };

        // Trigger decoding occasionally
        const intervalId = setInterval(() => {
            decodeText(".glitch-text");
        }, 5000);

        return () => clearInterval(intervalId);

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative py-32 overflow-hidden bg-black text-cyan-500 font-mono">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />

            {/* Decorative Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />

            <div className="container relative z-10 mx-auto px-4">
                <div className="text-center mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm holo-shard">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                        <span className="text-sm font-bold tracking-[0.2em] text-cyan-400">SYSTEM.2077 // ACTIVE</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400 glitch-text holo-shard">
                        NEURAL INTERVIEW PROTOCOL
                    </h2>
                    <p className="text-cyan-400/60 max-w-2xl mx-auto holo-shard">
                        Quantum-accelerated candidate analysis initiated. Biometric resonance operational.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center h-[600px]">

                    {/* Left Column: Biometrics & Stats */}
                    <div className="space-y-6 hidden lg:block">
                        <GlassCard className="floating-panel bg-black/40 border-cyan-500/30 p-6 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50" />
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> BIO-RHYTHM
                                </h3>
                                <span className="text-xs text-cyan-500/50">LIVE_FEED</span>
                            </div>
                            <div className="h-32 flex items-end gap-1 opacity-80">
                                {[...Array(20)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-full bg-cyan-500/20 hover:bg-cyan-400 transition-all duration-300"
                                        style={{
                                            height: `${Math.random() * 100}%`,
                                            animation: `pulse ${0.5 + Math.random()}s infinite`
                                        }}
                                    />
                                ))}
                            </div>
                        </GlassCard>

                        <GlassCard className="floating-panel bg-black/40 border-purple-500/30 p-6 relative holo-shard">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/40">
                                    <Cpu className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-purple-400/60">PROCESSING POWER</div>
                                    <div className="text-2xl font-bold text-purple-400 glitch-text">145.8 Q-Flops</div>
                                </div>
                            </div>
                            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[85%] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_1s_infinite]" />
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Center Column: The Core */}
                    <div className="relative h-full flex items-center justify-center">
                        {/* Central Rotating Rings */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[500px] h-[500px] border border-cyan-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
                            <div className="w-[400px] h-[400px] border border-cyan-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse] border-t-transparent border-b-transparent" />
                            <div className="w-[300px] h-[300px] border border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
                        </div>

                        {/* The AI Avatar Hologram */}
                        <div className="relative z-20 holo-shard">
                            <div
                                ref={coreRef}
                                className="w-48 h-48 rounded-full bg-black border-2 border-cyan-400 relative flex items-center justify-center overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.2),transparent_70%)]" />
                                <Brain className="w-24 h-24 text-cyan-400 animate-pulse relative z-10" />

                                {/* Scan Line */}
                                <div className="scan-line absolute top-0 left-0 right-0 h-1 bg-cyan-400/50 shadow-[0_0_20px_rgba(0,255,255,0.8)] z-20" />
                            </div>

                            {/* Connecting Lines */}
                            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] -z-10 pointer-events-none">
                                <path d="M300 300 L100 150" className="connect-line stroke-cyan-500/20" strokeWidth="1" fill="none" strokeDasharray="10 5" />
                                <path d="M300 300 L500 150" className="connect-line stroke-purple-500/20" strokeWidth="1" fill="none" strokeDasharray="10 5" />
                                <path d="M300 300 L100 450" className="connect-line stroke-cyan-500/20" strokeWidth="1" fill="none" strokeDasharray="10 5" />
                                <path d="M300 300 L500 450" className="connect-line stroke-purple-500/20" strokeWidth="1" fill="none" strokeDasharray="10 5" />
                            </svg>

                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center w-full">
                                <div className="inline-block px-3 py-1 bg-cyan-950/80 border border-cyan-500/50 rounded text-xs tracking-widest text-cyan-300 backdrop-blur-md">
                                    AI_MODERATOR
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interaction UI */}
                    <div className="space-y-6">
                        <GlassCard className="floating-panel bg-black/40 border-cyan-500/30 p-6 relative holo-shard">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                                        <MessageSquare className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div className="text-sm font-bold">TRANSCRIPT_LOG</div>
                                </div>
                                <Wifi className="w-4 h-4 text-green-500 animate-pulse" />
                            </div>
                            <div className="space-y-3 font-mono text-xs">
                                <div className="p-3 bg-cyan-500/5 rounded-r-xl rounded-bl-xl border-l-2 border-cyan-500">
                                    <span className="text-cyan-300 opacity-50 block mb-1">AI_CORE:</span>
                                    <span className="glitch-text text-cyan-100">Describe your experience with quantum neural networks.</span>
                                </div>
                                <div className="p-3 bg-purple-500/5 rounded-l-xl rounded-br-xl border-r-2 border-purple-500 text-right">
                                    <span className="text-purple-300 opacity-50 block mb-1">CANDIDATE_01:</span>
                                    <span className="text-purple-100">I have optimized synaptic weights for 300% efficiency...</span>
                                </div>
                                <div className="flex gap-1 mt-2">
                                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" />
                                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-100" />
                                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-200" />
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="floating-panel bg-black/40 border-red-500/30 p-6 relative overflow-hidden holo-shard">
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-500/20 blur-xl rounded-full" />
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/30">
                                    <ScanFace className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-red-400/60">STRESS ANALYSIS</div>
                                    <div className="text-sm font-bold text-red-100">ELEVATED LEVELS DETECTED</div>
                                </div>
                            </div>
                            <div className="flex items-end justify-between gap-1 h-12">
                                <span className="text-2xl font-black text-red-500">84%</span>
                                <div className="flex-1 h-2 bg-red-950 rounded-full ml-3 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-red-500 w-[84%] animate-[pulse_0.5s_infinite]" />
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="floating-panel bg-black/40 border-cyan-500/30 p-4 flex items-center justify-between holo-shard">
                            <div className="flex items-center gap-3">
                                <Fingerprint className="w-6 h-6 text-cyan-400" />
                                <div className="text-xs">
                                    <div className="text-cyan-400/50">IDENTITY</div>
                                    <div className="text-cyan-300 font-bold glitch-text">VERIFIED_SECURE</div>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold tracking-widest border border-green-500/30 rounded">
                                MATCH: 98.2%
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </section>
    );
};
