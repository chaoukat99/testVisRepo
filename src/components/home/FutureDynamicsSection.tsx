import { useRef } from "react";
import { motion } from "framer-motion";
import { Target, ShieldCheck, Globe, Cpu, Zap, Eye, Rocket, ArrowUpRight, BarChart3 } from "lucide-react";
import { AntigravityHeroBackground } from "@/components/home/AntigravityHeroBackground";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function FutureDynamicsSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
            }
        });

        tl.from(".reveal-text", {
            opacity: 0,
            y: 50,
            stagger: 0.1,
            duration: 1,
            ease: "power2.out",
        })
            .from(".pillar-card", {
                opacity: 0,
                y: 50,
                stagger: 0.1,
                duration: 0.8,
                ease: "expo.out",
            }, "-=0.5");

    }, { scope: containerRef });

    const pillars = [
        {
            icon: Eye,
            title: "Vision",
            label: "Predictive Intelligence",
            desc: "Nous anticipons les besoins avant qu'ils ne surgissent, créant une harmonie parfaite entre les ambitions des talents et les objectifs des entreprises. Une anticipation stratégique basée sur des modèles prédictifs avancés.",
            color: "text-cyan-400"
        },
        {
            icon: Zap,
            title: "Innovation",
            label: "Neural Architecture",
            desc: "Nos algorithmes dépassent l'analyse textuelle pour capturer l'essence même du potentiel humain et de la compatibilité culturelle. Une infrastructure évolutive conçue pour s'adapter à la complexité du marché moderne.",
            color: "text-purple-400"
        },
        {
            icon: Rocket,
            title: "Impact",
            label: "Strategic Growth",
            desc: "Chaque connexion est un catalyseur de succès. Nous transformons le recrutement en un avantage stratégique décisif et durable, maximisant le ROI de chaque placement grâce à une précision chirurgicale.",
            color: "text-emerald-400"
        },
        {
            icon: ShieldCheck,
            title: "Confiance",
            label: "Verified Ecosystem",
            desc: "Un environnement sécurisé où chaque profil est rigoureusement vérifié. La transparence totale et l'intégrité des données sont les piliers indéfectibles de notre forteresse digitale.",
            color: "text-blue-400"
        }
    ];

    return (
        <section
            ref={containerRef}
            className="relative min-h-[80vh] py-32 flex flex-col items-center justify-center overflow-hidden bg-background transition-colors duration-700"
        >
            <AntigravityHeroBackground />

            {/* Subtle Design Grid */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.03)_1px,transparent_1px)] [background-size:60px_60px]" />
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-border/50 to-transparent opacity-20" />
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-border/50 to-transparent opacity-20" />
            </div>

            <div className="container relative z-10 px-6">

                {/* Centered Header */}
                <div className="flex flex-col items-center text-center space-y-8 mb-20 max-w-4xl mx-auto">
                    <motion.div className="reveal-text flex items-center justify-center gap-3">
                        <span className="w-8 h-[1px] bg-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-primary">Manifeste de l'élite</span>
                        <span className="w-8 h-[1px] bg-primary" />
                    </motion.div>

                    <h2 className="reveal-text text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-foreground">
                        NOTRE <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--text-stroke-color)' }}>ESSENCE</span>
                    </h2>

                    <p className="reveal-text text-xl text-muted-foreground leading-relaxed font-light italic max-w-2xl">
                        "Nous ne nous contentons pas de connecter des personnes. Nous harmonisons des futurs."
                    </p>
                </div>

                {/* Centered Grid Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {pillars.map((pillar, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="pillar-card group relative flex flex-col p-8 md:p-10 rounded-[2rem] bg-background/40 dark:bg-white/5 backdrop-blur-md border border-border/50 hover:bg-background/80 dark:hover:bg-white/10 hover:border-primary/50 transition-all duration-500 shadow-lg"
                        >
                            <div className="absolute top-8 right-8 opacity-20 group-hover:opacity-100 transition-opacity">
                                <pillar.icon className={`w-12 h-12 ${pillar.color}`} />
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="space-y-1">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-80 ${pillar.color}`}>
                                        {pillar.label}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tight">
                                        {pillar.title}
                                    </h3>
                                </div>
                                <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base">
                                    {pillar.desc}
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-primary/10 flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground group-hover:text-primary transition-colors">
                                    0{i + 1} // Module
                                </span>
                                <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Subtle Stats Footer */}
                <div className="mt-20 pt-10 border-t border-border/10 flex justify-center text-[10px] text-muted-foreground uppercase tracking-widest gap-8 opacity-50">
                    <span>System Status: Optimized</span>
                    <span>Nodes: 24</span>
                    <span>Reach: Global</span>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] border border-primary/5 rounded-full pointer-events-none -z-10 animate-spin-slow-reverse opacity-20" />

            <style dangerouslySetInnerHTML={{
                __html: `
                :root { 
                    --text-stroke-color: rgba(0, 0, 0, 0.15); 
                    --primary-rgb: 6, 182, 212;
                }
                .dark { 
                    --text-stroke-color: rgba(255, 255, 255, 0.2); 
                }
            `}} />
        </section>
    );
}
