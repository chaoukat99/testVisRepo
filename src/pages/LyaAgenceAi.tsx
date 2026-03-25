
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
        title: "Automatisation des processus",
        icon: Bot,
        description: "réation d'agents IA, automatisation des emails, et gestion de flux de travail",
        color: "from-purple-500 to-indigo-600"
    },
    {
        title: "Solutions IA sur-mesure",
        icon: Wrench,
        description: " Développement de chatbots, assistants virtuels, et outils d'analyse prédictive.",
        color: "from-blue-500 to-cyan-500"
    },
    {
        title: "Conseil et intégration",
        icon: Library,
        description: "Analyse des besoins métiers et déploiement de solutions d'apprentissage automatique",
        color: "from-emerald-500 to-teal-500"
    },
    {
        title: "OpenIn Ai Academy",
        icon: FileCheck,
        description: "Plateforme de formation dédiée aux métiers de l'IA. L’ objectif est de transmettre les méthodes de conseil et de former des professionnels capables d’intervenir sur des missions stratégiques en IA",
        color: "from-orange-500 to-amber-500"
    },
    // {
    //     title: "Sécurité et Données",
    //     icon: FileText,
    //     description: "Intégration de données propres, structuration, et conformité réglementaire",
    //     color: "from-pink-500 to-rose-500"
    // },
    {
        title: "Agent IA Factory",
        icon: Search,
        description: "Développement et orchestration d'agents intelligents sur mesure pour automatiser les processus critiques, augmenter la performance opérationnelle et transformer durablement les organisations.",
        color: "from-violet-500 to-purple-500"
    },

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
                                badge="Univers GHAYA Agence AI"
                                title="Rendre l’intelligence artificielle opérationnelle ."
                                description="Ghaya est Une agence IA spécialisée dans l'intégration de l'intelligence artificielle pour optimiser la performance opérationnelle, automatiser les processus et créer des solutions sur-mesure.  "
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
