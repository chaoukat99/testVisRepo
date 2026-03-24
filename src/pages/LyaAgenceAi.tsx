
import { motion } from "framer-motion";
import { CircularNavbar } from "@/components/layout/CircularNavbar";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/home/CTASection";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionDivider } from "@/components/ui/SectionDivider";
import {
    Bot,
    Wrench,
    Library,
    FileCheck,
    FileText,
    Search,
    GraduationCap,
    Sparkles
} from "lucide-react";

const features = [
    {
        title: "AGENTS IA",
        icon: Bot,
        description: "Accédez à nos agents intelligents spécialisés pour automatiser vos tâches et augmenter votre productivité.",
        color: "from-purple-500 to-indigo-600"
    },
    {
        title: "BOITE A OUTILS",
        icon: Wrench,
        description: "Une suite complète d'outils numériques et de templates pour accélérer vos projets et missions.",
        color: "from-blue-500 to-cyan-500"
    },
    {
        title: "BIBLIOTHEQUE",
        icon: Library,
        description: "Une vaste collection de ressources, livres blancs et documentations techniques à portée de main.",
        color: "from-emerald-500 to-teal-500"
    },
    {
        title: "Optimisation CV",
        icon: FileCheck,
        description: "Analysez et améliorez votre CV grâce à nos algorithmes d'IA pour maximiser vos chances.",
        color: "from-orange-500 to-amber-500"
    },
    {
        title: "ARTICLES",
        icon: FileText,
        description: "Restez informé avec nos articles de fond sur les tendances de l'IA, du freelancing et de la tech.",
        color: "from-pink-500 to-rose-500"
    },
    {
        title: "RECHERCHE GUIDES",
        icon: Search,
        description: "Des guides détaillés pour naviguer dans l'écosystème freelance et réussir vos missions.",
        color: "from-violet-500 to-purple-500"
    },
    {
        title: "FORMATION et CERTIFICATION",
        icon: GraduationCap,
        description: "Parcours de formation certifiants pour valider vos compétences et booster votre carrière.",
        color: "from-yellow-400 to-orange-500"
    },
    {
        title: "FORMATION et CERTIFICATION",
        icon: GraduationCap,
        description: "Parcours de formation certifiants pour valider vos compétences et booster votre carrière.",
        color: "from-yellow-400 to-orange-500"
    }
];

export default function LyaAgenceAi() {
    return (
        <div className="min-h-screen bg-background">
            <SEO title="GHAYA Agence Ai - Ressources & Outils" />
            <div className="particles-bg" />
            <CircularNavbar />
            <main className="pt-0">
                <section className="relative pt-0 pb-24 overflow-hidden" style={{ marginTop: 120 }}>
                    {/* Background elements */}
                    <div className="absolute inset-0 grid-pattern opacity-50" />

                    <div className="container relative z-10 px-6">
                        <div className="flex flex-col items-center mb-12">
                            <SectionHeading
                                badge="Ecosystème GHAYA"
                                title="Ressources & Accélérateurs"
                                description="Tous les outils dont vous avez besoin pour exceller dans vos missions."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <GlassCard className="h-full hover:scale-[1.02] transition-transform duration-300 cursor-pointer group" glow>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div
                                                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex-shrink-0 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                            >
                                                <feature.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground leading-tight">
                                                {feature.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <SectionDivider />
                </section>
                {/* <CTASection type="consultant" /> */}
            </main>
            <Footer />
        </div>
    );
}
