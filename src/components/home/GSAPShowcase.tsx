import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Brain, Network, Cpu, Zap, Activity, Sparkles, Code2, Database, Lock, Fingerprint, Users, Building2, Briefcase, Info } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { SectionGlow } from "@/components/ui/SectionGlow";
import { Logo } from "@/components/ui/Logo";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export const GSAPShowcase = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { t } = useLanguage();
    const [selectedNode, setSelectedNode] = useState<{ id: string; title: string; desc: string; icon: any; color: string } | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const yMove = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

    const techStack = [
        { name: "TensorFlow", icon: Brain, color: "text-orange-500" },
        { name: "Node.js", icon: Code2, color: "text-green-500" },
        { name: "PostgreSQL", icon: Database, color: "text-blue-500" },
        { name: "CyberSec", icon: Lock, color: "text-red-500" },
    ];

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            }
        });

        tl.from(".tech-card", {
            y: 100,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "back.out(1.7)",
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative pt-0 pb-32 overflow-hidden bg-background">
            <SectionDivider flip className="top-0 bottom-auto" fill="fill-background" />
            {/* Animated Background Lines */}
            <div className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="container relative z-10 px-6 -mt-20">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Left: Content Text */}
                    <motion.div
                        style={{ y: yMove }}
                        className="lg:w-1/2 space-y-8"
                    >
                        <h2 style={{ fontSize: 35 }} className="text-2xl md:text-3xl lg:text-[40px] font-black tracking-tight leading-tight text-foreground flex flex-wrap gap-x-4">
                            <span>{t('gsap_showcase.title_part1')}</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                                {t('gsap_showcase.title_highlight')}
                            </span>
                            <span>{t('gsap_showcase.title_part2')}</span>
                        </h2>

                        <p className="text-lg text-muted-foreground leading-relaxed max-w-full font-light">
                            {t('gsap_showcase.description').split('\n').map((part, index) => (
                                <span key={index}>
                                    {part}
                                    {index !== t('gsap_showcase.description').split('\n').length - 1 && <><br /><br /></>}
                                </span>
                            ))}
                        </p>

                        {/* Feature Stack Mini-Grid */}
                        {/* <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50 backdrop-blur-sm">
                                <Brain className="w-5 h-5 text-orange-500" />
                                <span className="text-sm font-bold text-foreground/80">{t('gsap_showcase.stack.sourcing')}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50 backdrop-blur-sm">
                                <Zap className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-bold text-foreground/80">{t('gsap_showcase.stack.matching')}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50 backdrop-blur-sm">
                                <Activity className="w-5 h-5 text-blue-500" />
                                <span className="text-sm font-bold text-foreground/80">{t('gsap_showcase.stack.analytics')}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50 backdrop-blur-sm">
                                <Lock className="w-5 h-5 text-red-500" />
                                <span className="text-sm font-bold text-foreground/80">{t('gsap_showcase.stack.compliance')}</span>
                            </div>
                        </div> */}
                    </motion.div>

                    {/* Right: Visual Showcase */}
                    <div className="lg:w-1/2 relative h-[600px] w-full flex items-center justify-center perspective-1000">
                        {/* Hexagonal Core System */}
                        <motion.div
                            style={{ rotateX: rotate, rotateY: rotate }}
                            className="relative w-[500px] h-[500px] flex items-center justify-center transform-3d"
                        >
                            {/* Ambient Glow */}
                            <div className="absolute w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full opacity-50 pointer-events-none" />

                            {/* Connecting Lines (SVG) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                                {/* Top to Bottom */}
                                <line x1="50%" y1="50%" x2="50%" y2="10%" stroke="currentColor" className="text-primary/20" strokeWidth="2" strokeDasharray="4 4" />
                                <line x1="50%" y1="50%" x2="50%" y2="90%" stroke="currentColor" className="text-primary/20" strokeWidth="2" strokeDasharray="4 4" />
                                {/* Left to Right */}
                                <line x1="50%" y1="50%" x2="10%" y2="50%" stroke="currentColor" className="text-primary/20" strokeWidth="2" strokeDasharray="4 4" />
                                <line x1="50%" y1="50%" x2="90%" y2="50%" stroke="currentColor" className="text-primary/20" strokeWidth="2" strokeDasharray="4 4" />

                                <circle cx="50%" cy="50%" r="180" fill="none" stroke="currentColor" className="text-primary/5" strokeWidth="1" />
                            </svg>

                            {/* Center Core Hexagon */}
                            <div className="relative z-20 w-48 h-52 group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-xl clip-hex transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/30" />
                                <div className="absolute inset-[2px] bg-background clip-hex flex items-center justify-center">
                                    <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                        <Logo size="lg" animate={false} />
                                    </div>
                                </div>
                                {/* Decorative borders */}
                                <div className="absolute inset-0 border-2 border-primary/50 clip-hex pointer-events-none" />
                            </div>

                            {/* Satellite Nodes */}
                            {/* Top: Talent */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 tech-card">
                                <HexNode
                                    icon={Users}
                                    label={t('gsap_showcase.visual.talent')}
                                    color="text-blue-400"
                                    onClick={() => setSelectedNode({
                                        id: 'talent',
                                        title: t('gsap_showcase.visual.talent'),
                                        desc: t('gsap_showcase.visual.talent_desc'),
                                        icon: Users,
                                        color: 'text-blue-400'
                                    })}
                                />
                            </div>
                            {/* Right: Ghaya */}
                            <div className="absolute top-1/2 right-0 -translate-y-1/2 tech-card">
                                <HexNode
                                    icon={Sparkles}
                                    label={t('gsap_showcase.visual.ghaya')}
                                    color="text-purple-400"
                                    onClick={() => setSelectedNode({
                                        id: 'ghaya',
                                        title: t('gsap_showcase.visual.ghaya'),
                                        desc: t('gsap_showcase.visual.ghaya_desc'),
                                        icon: Sparkles,
                                        color: 'text-purple-400'
                                    })}
                                />
                            </div>
                            {/* Bottom: Cabinet */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 tech-card">
                                <HexNode
                                    icon={Briefcase}
                                    label={t('gsap_showcase.visual.cabinet')}
                                    color="text-orange-400"
                                    onClick={() => setSelectedNode({
                                        id: 'cabinet',
                                        title: t('gsap_showcase.visual.cabinet'),
                                        desc: t('gsap_showcase.visual.cabinet_desc'),
                                        icon: Briefcase,
                                        color: 'text-orange-400'
                                    })}
                                />
                            </div>
                            {/* Left: Company */}
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 tech-card">
                                <HexNode
                                    icon={Building2}
                                    label={t('gsap_showcase.visual.company')}
                                    color="text-emerald-400"
                                    onClick={() => setSelectedNode({
                                        id: 'company',
                                        title: t('gsap_showcase.visual.company'),
                                        desc: t('gsap_showcase.visual.company_desc'),
                                        icon: Building2,
                                        color: 'text-emerald-400'
                                    })}
                                />
                            </div>

                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Entity Details Modal */}
            <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
                <DialogContent className="sm:max-w-lg bg-[#020617]/95 border-primary/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(59,130,246,0.2)] max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                                {selectedNode && <selectedNode.icon className={`w-8 h-8 ${selectedNode.color}`} />}
                            </div>
                            <DialogTitle className="text-2xl font-black tracking-tight text-white uppercase">
                                {selectedNode?.title}
                            </DialogTitle>
                        </div>
                        <div
                            className="text-lg text-white/70 leading-relaxed font-light whitespace-pre-line"
                            dangerouslySetInnerHTML={{ __html: selectedNode?.desc || '' }}
                        />
                    </DialogHeader>
                    <div className="mt-8 flex justify-end">
                        <DialogTitle className="sr-only">Actions</DialogTitle>
                        <button
                            onClick={() => setSelectedNode(null)}
                            className="px-6 py-2 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-all text-sm"
                        >
                            Fermer
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            <style dangerouslySetInnerHTML={{
                __html: `
                .clip-hex {
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-3d {
                    transform-style: preserve-3d;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}} />
            <SectionDivider fill="fill-black" />
        </section>
    );
};

const HexNode = ({ icon: Icon, label, color, onClick }: { icon: any, label: string, color: string, onClick: () => void }) => (
    <div
        onClick={onClick}
        className="w-28 h-32 relative group cursor-pointer transition-transform hover:-translate-y-2 duration-300"
    >
        <div className="absolute inset-0 bg-secondary/80 backdrop-blur-md clip-hex border border-white/10 shadow-xl transition-colors group-hover:bg-primary/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-2 text-center">
            <Icon className={`w-8 h-8 ${color} mb-2 drop-shadow-lg`} />
            <span className="text-[10px] font-bold text-foreground/70 tracking-wider uppercase">{label}</span>
        </div>
    </div>
);
