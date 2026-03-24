import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Building2, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { SectionGlow } from "@/components/ui/SectionGlow";

gsap.registerPlugin(ScrollTrigger);

export const SynergyDNASection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { t } = useLanguage();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles: { x: number; y: number; strand: number; phaseOffset: number; baseY: number }[] = [];
        const particleCount = 60; // Particles per strand
        const speed = 0.02; // Rotation speed
        let time = 0;

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            // Strand A
            particles.push({
                x: 0,
                y: 0,
                strand: 0,
                phaseOffset: (i / particleCount) * Math.PI * 8, // How many twists
                baseY: (i / particleCount) * height + height * 0.1 // Spread vertically
            });
            // Strand B
            particles.push({
                x: 0,
                y: 0,
                strand: 1,
                phaseOffset: (i / particleCount) * Math.PI * 8 + Math.PI, // Opposite phase
                baseY: (i / particleCount) * height + height * 0.1
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Gradient for connections - moving with time
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, "#3b82f6"); // Blue
            gradient.addColorStop(1, "#a855f7"); // Purple

            time += speed;

            // Update and draw particles
            const amplitude = width * 0.15; // Width of helix
            const centerX = width / 2;

            // We'll store calculated positions to draw connections later
            const currentPositions: { x: number, y: number, strand: number }[] = [];

            particles.forEach(p => {
                // Basic Helix Math
                p.x = centerX + Math.sin(p.phaseOffset + time) * amplitude;
                p.y = p.baseY;

                // Scale/Z-index simulation
                const depth = Math.cos(p.phaseOffset + time); // -1 to 1
                const scale = 1 + depth * 0.3; // 0.7 to 1.3
                const alpha = 0.3 + (depth + 1) / 2 * 0.7; // Fades when in back

                currentPositions.push({ x: p.x, y: p.y, strand: p.strand });

                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3 * scale, 0, Math.PI * 2);
                ctx.fillStyle = p.strand === 0 ? `rgba(59, 130, 246, ${alpha})` : `rgba(168, 85, 247, ${alpha})`;
                ctx.fill();
            });

            // Draw Connections (DNA Bridges)
            // Connect Strand A particle `i` to Strand B particle `i`
            for (let i = 0; i < particleCount; i++) {
                const pA = currentPositions[i * 2]; // Strand A
                const pB = currentPositions[i * 2 + 1]; // Strand B match

                // Calculate distance for opacity (fade out when strands are far apart visually?? No, DNA rungs are constant)
                // But let's make them fade when "in back"
                const depth = Math.cos(particles[i * 2].phaseOffset + time);
                const alpha = 0.1 + (depth + 1) / 2 * 0.4;

                ctx.beginPath();
                ctx.moveTo(pA.x, pA.y);
                ctx.lineTo(pB.x, pB.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Occasional "Data Pulse" on the line
                if (Math.random() > 0.95) {
                    const t = Math.random(); // Position on line
                    const pulseX = pA.x + (pB.x - pA.x) * t;
                    const pulseY = pA.y + (pB.y - pA.y) * t;

                    ctx.beginPath();
                    ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
                    ctx.fillStyle = "#fff";
                    ctx.fill();
                }
            }

            requestAnimationFrame(animate);
        }

        const animationId = requestAnimationFrame(animate);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationId);
        }

    }, []);

    useGSAP(() => {
        // Scroll triggers for text
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top center",
                end: "bottom center",
                toggleActions: "play reverse play reverse",
            }
        });

        tl.from(".dna-content", {
            x: -50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });

        tl.from(".dna-card", {
            x: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            delay: 0.2,
            ease: "back.out(1.7)"
        }, "<");

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative min-h-screen flex flex-col justify-start overflow-hidden bg-black pt-4 pb-24">
            {/* Canvas Background */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 opacity-60" />

            {/* Content Overlay */}
            <div className="container relative z-10 px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left: Text Content */}
                    <div className="dna-content space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            {t('synergy_dna.badge')}
                        </div>

                        <h2 className="text-2xl md:text-4xl font-bold font-heading leading-tight text-white">
                            {t('synergy_dna.title')}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                {t('synergy_dna.title_highlight')}
                            </span>
                        </h2>

                        <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                            {t('synergy_dna.description')}
                        </p>

                    
                    </div>

                    {/* Right: Floating Cards (Simulating 'Matches') */}
                    <div className="relative h-[600px]">
                        {/* Central visualization is mainly the canvas, but let's add some floating UI cards that interact with the 'DNA' visually */}

                        {/* Card 1: Consultant */}
                        <div className="dna-card absolute top-0 right-10 md:right-20 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl w-64 shadow-2xl shadow-blue-500/10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center text-black font-bold text-xs">CF</div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">CONSULTANT-FREELANCER</h4>
                                    <p className="text-xs text-blue-300">{t('synergy_dna.cards.expert')}</p>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[92%]"></div>
                            </div>
                            <div className="mt-2 flex justify-between text-xs text-gray-400">
                                <span>{t('synergy_dna.cards.competence')}</span>
                                <span className="text-white">92%</span>
                            </div>
                        </div>

                        {/* Card 2: Match */}
                        <div className="dna-card absolute top-[35%] left-0 md:left-10 -translate-y-1/2 p-4 rounded-full bg-black/60 border border-green-500/50 backdrop-blur-xl flex items-center gap-4 pr-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">{t('synergy_dna.cards.match_confirmed')}</div>
                                <div className="text-xs text-green-400">{t('synergy_dna.cards.optimal_synergy')}</div>
                            </div>
                        </div>

                        {/* Card 3: Company */}
                        <div className="dna-card absolute top-[45%] right-0 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl w-64 shadow-2xl shadow-purple-500/10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-300 flex items-center justify-center text-black font-bold">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">TechCorp Inc.</h4>
                                    <p className="text-xs text-purple-300">{t('synergy_dna.cards.long_mission')}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex gap-2 flex-wrap">
                                    <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-gray-300 border border-white/5">Remote</span>
                                    <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-gray-300 border border-white/5">Senior</span>
                                    <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-gray-300 border border-white/5">React</span>
                                </div>
                            </div>
                        </div>

                         {/* Card 4: Technical Validation (Newly updated) */}
                         <div className="dna-card absolute top-[65%] left-0 md:left-10 p-4 rounded-full bg-black/60 border border-cyan-500/50 backdrop-blur-xl flex items-center gap-4 pr-8 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
                                <Zap className="w-6 h-6 text-cyan-500" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">{t('synergy_dna.cards.validated_expertise')}</div>
                                <div className="text-xs text-cyan-400">{t('synergy_dna.cards.technical_score')}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <SectionDivider />
        </section>
    );
};
