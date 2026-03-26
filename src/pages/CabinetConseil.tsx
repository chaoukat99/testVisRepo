
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
        title: "Accédez à des expertises indépendantes",
        icon: Briefcase,
        description: "Accès rapide à des talents hautement qualifiés pour répondre aux besoins de missions, absorber les pics d’activité et accéder à des expertises rares.",
        color: "from-blue-500 to-indigo-600"
    },
    {
        title: "Recherche Profils & Entretien IA",
        icon: Bot,
        description: "Utilisez notre technologie d'IA pour identifier et évaluer les meilleurs talents pour vos recrutements.",
        color: "from-purple-500 to-pink-500"
    },
    {
        title: "Openin Consulting Academy",
        icon: FileText,
        description: "Plateforme de formation dédiée aux métiers du conseil. L’ objectif est de transmettre les méthodes  de conseil et de former des professionnels capables d’intervenir sur des missions stratégiques",
        color: "from-amber-400 to-orange-500"
    },
    {
        title: "Augmentez vos équipes grâce à l’IA Ghaya",
        icon: Radar,
        description: "Les cabinets partenaires d’Openin peuvent bénéficier des outils IA développés par Ghaya, l’agence IA de la plateforme. Les cabinets peuvent ainsi offrir davantage de valeur à leurs clients et consultants.",
        color: "from-emerald-400 to-teal-500"
    },
    {
        title: "Etude stratégique et sectorielle",
        icon: Radar,
        description: "Accès à des études sectorielles et stratégiques pour éclairer vos décisions et enrichir vos missions.",
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
                                badge="Univers Cabinets de Conseil"
                                title="Augmentez la capacité et la flexibilité de votre cabinet"
                                description=""
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
