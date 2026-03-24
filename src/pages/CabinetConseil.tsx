
import { motion } from "framer-motion";
import { CircularNavbar } from "@/components/layout/CircularNavbar";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/home/CTASection";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionDivider } from "@/components/ui/SectionDivider";
import {
    Briefcase,
    Bot,
    FileText,
    Radar
} from "lucide-react";

const features = [
    {
        title: "Offre de recrutement",
        icon: Briefcase,
        description: "Découvrez nos opportunités de carrière et rejoignez une équipe d'experts passionnés.",
        color: "from-blue-500 to-indigo-600"
    },
    {
        title: "Recherche Profils & Entretien IA",
        icon: Bot,
        description: "Utilisez notre technologie d'IA pour identifier et évaluer les meilleurs talents pour vos besoins.",
        color: "from-purple-500 to-pink-500"
    },
    {
        title: "Article Recherche GUIDES",
        icon: FileText,
        description: "Accédez à nos guides exclusifs et articles de recherche pour approfondir vos connaissances.",
        color: "from-amber-400 to-orange-500"
    },
    {
        title: "Veille Technologique",
        icon: Radar,
        description: "Restez à la pointe de l'innovation grâce à notre système de veille technologique automatisée.",
        color: "from-emerald-400 to-teal-500"
    }
];

export default function CabinetConseil() {
    return (
        <div className="min-h-screen bg-background">
            <SEO title="Cabinet de Conseil - Services & Expertise" />
            <div className="particles-bg" />
            <CircularNavbar />
            <main className="pt-0">
                <section className="relative pt-0 pb-24 overflow-hidden" style={{ marginTop: 120 }}>
                    {/* Background elements */}
                    <div className="absolute inset-0 grid-pattern opacity-50" />

                    <div className="container relative z-10 px-6">
                        <div className="flex flex-col items-center mb-12">
                            <SectionHeading
                                badge="Cabinets de Conseil"
                                title="Cabinet de Conseil"
                                description="Accompagnement stratégique et solutions technologiques avancées."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                {/* <CTASection type="company" /> */}
            </main>
            <Footer />
        </div>
    );
}
