import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Search,
  Users,
  Building2,
  Brain,
  Zap,
  Shield,
  Globe,
  Star,
  LayoutList,
  Target,
  Trophy,
  LayoutDashboard,
  Bot,
  Wrench,
  Calendar,
  Library,
  Book,
  Video,
  Newspaper,
  Mic,
  Briefcase,
  FileCheck,
  TrendingUp,
  Truck,
  SearchCheck,
  ShieldCheck,
  Clock,
  Headphones,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { SectionGlow } from "@/components/ui/SectionGlow";

interface FeaturesSectionProps {
  type: "company" | "consultant" | "freelancer" | "resources" | "home";
  showDescription?: boolean;
  maxItems?: number;
  showBadge?: boolean;
}

export function FeaturesSection({ type, showDescription = true, maxItems, showBadge = true }: FeaturesSectionProps) {
  const { t } = useLanguage();

  const homeFeatures = [
    {
      icon: Brain,
      title: t('features_home.items.matching_ai.title'),
      description: t('features_home.items.matching_ai.desc'),
      color: "from-primary to-cyan-400",
      link: "/company/dashboard",
    },
    {
      icon: Search,
      title: t('features_home.items.search.title'),
      description: t('features_home.items.search.desc'),
      color: "from-accent to-pink-400",
      link: "/company/search-talents",
    },
    {
      icon: Users,
      title: t('features_home.items.consultants_base.title'),
      description: t('features_home.items.consultants_base.desc'),
      color: "from-emerald-400 to-teal-400",
      link: "/company/missions",
    },
    {
      icon: LayoutDashboard,
      title: t('features_home.items.company_portal.title'),
      description: t('features_home.items.company_portal.desc'),
      color: "from-orange-400 to-amber-400",
    },
    {
      icon: Zap,
      title: t('features_home.items.instant_match.title'),
      description: t('features_home.items.instant_match.desc'),
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Shield,
      title: t('features_home.items.verified_profiles.title'),
      description: t('features_home.items.verified_profiles.desc'),
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Globe,
      title: t('features_home.items.global_network.title'),
      description: t('features_home.items.global_network.desc'),
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: Star,
      title: t('features_home.items.smart_reco.title'),
      description: t('features_home.items.smart_reco.desc'),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      title: t('features_home.items.analytics.title'),
      description: t('features_home.items.analytics.desc'),
      color: "from-blue-600 to-cyan-400",
    },
    {
      icon: Shield,
      title: t('features_home.items.compliance.title'),
      description: t('features_home.items.compliance.desc'),
      color: "from-emerald-500 to-teal-400",
    },
    {
      icon: SearchCheck,
      title: t('features_home.items.sourcing.title'),
      description: t('features_home.items.sourcing.desc'),
      color: "from-indigo-400 to-purple-500",
    },
    {
      icon: Mic,
      title: t('features_home.items.support.title'),
      description: t('features_home.items.support.desc'),
      color: "from-orange-400 to-amber-400",
    },
  ];

  const companyFeatures = [
    {
      icon: Brain,
      title: t('features_company.items.matching_ai.title'),
      description: t('features_company.items.matching_ai.desc'),
      color: "from-primary to-cyan-400",
      link: "/company/dashboard",
    },
    {
      icon: Search,
      title: t('features_company.items.search.title'),
      description: t('features_company.items.search.desc'),
      color: "from-accent to-pink-400",
      link: "/company/search-talents",
    },
    {
      icon: Users,
      title: t('features_company.items.consultants_base.title'),
      description: t('features_company.items.consultants_base.desc'),
      color: "from-emerald-400 to-teal-400",
      link: "/company/missions",
    },
    {
      icon: LayoutDashboard,
      title: t('features_company.items.company_portal.title'),
      description: t('features_company.items.company_portal.desc'),
      color: "from-orange-400 to-amber-400",
    },
    {
      icon: Zap,
      title: t('features_company.items.instant_match.title'),
      description: t('features_company.items.instant_match.desc'),
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Shield,
      title: t('features_company.items.verified_profiles.title'),
      description: t('features_company.items.verified_profiles.desc'),
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Globe,
      title: t('features_company.items.global_network.title'),
      description: t('features_company.items.global_network.desc'),
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: Star,
      title: t('features_company.items.smart_reco.title'),
      description: t('features_company.items.smart_reco.desc'),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      title: t('features_company.items.analytics.title'),
      description: t('features_company.items.analytics.desc'),
      color: "from-blue-600 to-cyan-400",
    },
    {
      icon: Shield,
      title: t('features_company.items.compliance.title'),
      description: t('features_company.items.compliance.desc'),
      color: "from-emerald-500 to-teal-400",
    },
    {
      icon: SearchCheck,
      title: t('features_company.items.sourcing.title'),
      description: t('features_company.items.sourcing.desc'),
      color: "from-indigo-400 to-purple-500",
    },
    {
      icon: Mic,
      title: t('features_company.items.support.title'),
      description: t('features_company.items.support.desc'),
      color: "from-orange-400 to-amber-400",
    },
  ];

  const consultantFeatures = [
    {
      icon: LayoutDashboard,
      title: "Valoriser votre CV & Expertise",
      description: "Envirenement permettant d'analyser et  d'optimiser votre CV pour ATS .  ",
      color: "from-blue-500 to-indigo-400",
      link: "/consultant/dashboard",
    },
    {
      icon: Bot,
      title: " Accédez à des missions à forte valeur",
      description: "Openin sélectionne des missions stratégiques proposées par des entreprises en transformation.<br>Vous intervenez sur des projets qui nécessitent une expertise réelle",
      color: "from-amber-400 to-orange-400",
    },
    {
      icon: Wrench,
      title: "Boîte à outils & templates",
      description: "Accédez à des modèles de documents et des outils exclusifs pour faciliter votre travail quotidien.",
      color: "from-purple-500 to-pink-400",
    },
    {
      icon: ShieldCheck,
      title: t('features_consultant.items.secure_payments.title'),
      description: t('features_consultant.items.secure_payments.desc'),
      color: "from-emerald-400 to-teal-500",
    },
    {
      icon: Clock,
      title: t('features_consultant.items.flexibility.title'),
      description: t('features_consultant.items.flexibility.desc'),
      color: "from-purple-500 to-indigo-500",
    },
  ];

  const freelancerFeatures = consultantFeatures;

  const resourcesFeatures = [
    {
      icon: Library,
      title: "Bibliothèque",
      description: "Une vaste collection de livres blancs, e-books et documentations pour approfondir vos connaissances.",
      color: "from-indigo-500 to-violet-500",
      link: "/bibliotheque",
    },
    {
      icon: Book,
      title: "Guides Pratiques",
      description: "Des tutoriels pas à pas et des guides experts pour réussir vos projets et votre carrière.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Video,
      title: "Webinaires & Replays",
      description: "Accédez à nos conférences en ligne et retrouvez les replays de nos experts.",
      color: "from-cyan-400 to-blue-500",
    },
    {
      icon: Newspaper,
      title: "Blog Tech",
      description: "L'actualité de la tech, de l'IA et du freelancing décryptée par nos spécialistes.",
      color: "from-emerald-400 to-green-500",
    },
    {
      icon: Mic,
      title: "Podcast",
      description: "Écoutez des interviews exclusives d'experts et découvrez les coulisses du monde de la tech.",
      color: "from-orange-400 to-red-500",
    },
  ];

  const managerFeatures = consultantFeatures;

  const [activeCategory, setActiveCategory] = useState<"consultant" | "freelance" | "manager">("consultant");

  const getFilteredFeatures = () => {
    if (type === "home") return homeFeatures;
    if (type !== "consultant") return type === "company" ? companyFeatures : type === "resources" ? resourcesFeatures : freelancerFeatures;

    switch (activeCategory) {
      case "consultant":
        return consultantFeatures;
      case "freelance":
        return freelancerFeatures;
      case "manager":
        return managerFeatures;
      default:
        return consultantFeatures;
    }
  };

  const features = maxItems ? getFilteredFeatures().slice(0, maxItems) : getFilteredFeatures();

  const getHeadingData = () => {
    if (type === "resources") {
      return {
        badge: "RESSOURCES",
        title: "Centre de Ressources",
        description: "Explorez nos guides, articles et outils pour optimiser votre recrutement et votre carrière."
      };
    }

    // Default translation keys for other types
    const key = `features_${type}`;
    return {
      badge: t(`${key}.heading.badge`),
      title: t(`${key}.heading.title`),
      description: t(`${key}.heading.description`)
    };
  };

  const headingData = getHeadingData();

  const categoryDescriptions = {
    consultant: t('features_consultant.categories.consultant'),
    freelance: t('features_consultant.categories.freelance'),
    manager: t('features_consultant.categories.manager')
  };

  return (
    <section id={type === "company" ? "features-company" : "features-consultant"} className="relative pt-0 pb-12 overflow-hidden" style={{ marginTop: 120 }}>
      {/* Background elements */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      <div className="container relative z-10 px-6">
        <div className="flex flex-col items-center mb-6">
          {showBadge && (
            <SectionHeading
              badge={headingData.badge}
              title={type === "consultant" ? undefined : headingData.title}
              description={type === "consultant" ? undefined : headingData.description}
            />
          )}

          {type === "consultant" && (
            <>
              <div className="flex flex-wrap justify-center gap-3 mb-8 bg-background border border-border p-2 rounded-full shadow-sm">
                <button
                  onClick={() => setActiveCategory("consultant")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === "consultant"
                    ? "bg-foreground text-background shadow-lg"
                    : "text-foreground hover:bg-muted"
                    }`}
                >
                  Consultant
                </button>
                <button
                  onClick={() => setActiveCategory("freelance")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === "freelance"
                    ? "bg-foreground text-background shadow-lg"
                    : "text-foreground hover:bg-muted"
                    }`}
                >
                  Freelance Tech
                </button>
                <button
                  onClick={() => setActiveCategory("manager")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === "manager"
                    ? "bg-foreground text-background shadow-lg"
                    : "text-foreground hover:bg-muted"
                    }`}
                >
                  Manager de Transition
                </button>
              </div>
              <motion.p
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-lg text-muted-foreground max-w-2xl text-center"
              >
                {categoryDescriptions[activeCategory]}
              </motion.p>
            </>
          )}
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${features.length === 5 ? 'lg:grid-cols-5' : features.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
          <AnimatePresence mode="wait">
            {features.map((feature, index) => (
              <motion.div
                key={`${type}-${activeCategory}-${feature.title}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* @ts-ignore */}
                {feature.link ? (
                  /* @ts-ignore */
                  <Link to={feature.link} className="block h-full">
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
                      {showDescription && feature.description && (
                        <div
                          className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line"
                          dangerouslySetInnerHTML={{ __html: feature.description }}
                        />
                      )}
                    </GlassCard>
                  </Link>
                ) : (
                  <GlassCard className="h-full group" glow>
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
                    {showDescription && feature.description && (
                      <div
                        className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: feature.description }}
                      />
                    )}
                  </GlassCard>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <SectionDivider />
    </section>
  );
}
