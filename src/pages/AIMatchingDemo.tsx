import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Search,
  Users,
  Zap,
  ArrowRight,
  X,
  CheckCircle,
  Brain,
  FileSearch,
  PenTool,
  TrendingUp,
  ShieldCheck,
  Mic,
  Cpu,
  Bot,
  Layers,
  BarChart3
} from "lucide-react";
import { CircularNavbar } from "@/components/layout/CircularNavbar";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useDataStore, Consultant } from "@/store/dataStore";
import { cn } from "@/lib/utils";

interface AIService {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  tags: string[];
  status: "active" | "beta" | "upcoming";
}

const AI_SERVICES: AIService[] = [
  {
    id: "matching",
    title: "Matching Intelligent",
    description: "Algorithme propriétaire de mise en relation basé sur l'analyse sémantique des compétences et le fit culturel.",
    icon: Brain,
    color: "text-blue-400",
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
    tags: ["Matching", "NLP"],
    status: "active",
  },
  {
    id: "resume",
    title: "Analyse Profil 360°",
    description: "Extraction automatique de compétences, scoring d'expérience et extraction de soft-skills à partir de n'importe quel document.",
    icon: FileSearch,
    color: "text-emerald-400",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    tags: ["Parsing", "OCR"],
    status: "active",
  },
  {
    id: "prediction",
    title: "Prédiction de Succès",
    description: "Intelligence prédictive utilisant le machine learning pour évaluer la probabilité de réussite d'une mission.",
    icon: TrendingUp,
    color: "text-fuchsia-400",
    gradient: "from-fuchsia-500/20 via-purple-500/10 to-transparent",
    tags: ["Big Data", "ML"],
    status: "beta",
  },
  {
    id: "generator",
    title: "Architecte de Mission",
    description: "Générez des descriptions de mission optimisées pour le SEO et l'attractivité en quelques secondes.",
    icon: PenTool,
    color: "text-orange-400",
    gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
    tags: ["Generative AI", "LLM"],
    status: "active",
  },
  {
    id: "contracts",
    title: "Contract Genius",
    description: "Automatisation et sécurisation juridique des contrats de prestation via analyse de clauses intelligentes.",
    icon: ShieldCheck,
    color: "text-rose-400",
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    tags: ["LegalTech", "Security"],
    status: "upcoming",
  },
  {
    id: "sentiment",
    title: "Sentiment Hub",
    description: "Analyse vocale et textuelle des entretiens pour détecter l'enthousiasme et l'adéquation au projet.",
    icon: Mic,
    color: "text-cyan-400",
    gradient: "from-cyan-500/20 via-sky-500/10 to-transparent",
    tags: ["Voice Analysis", "EQ"],
    status: "beta",
  }
];

export default function AIMatchingDemo() {
  const consultants = useDataStore((state) => state.consultants);
  const [activeService, setActiveService] = useState<string | null>(null);

  // Matching tool state
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<{ consultant: Consultant; score: number }[]>([]);
  const [showResults, setShowResults] = useState(false);

  const popularSkills = [
    "React", "Node.js", "TypeScript", "Python", "AWS", "Machine Learning",
    "Docker", "Kubernetes", "Figma", "Data Science",
  ];

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills((prev) => [...prev, trimmedSkill]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const runMatching = async () => {
    if (skills.length === 0) return;
    setIsMatching(true);
    setShowResults(false);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const scoredConsultants = consultants.map((consultant) => {
      const matchingSkills = consultant.skills.filter((s) =>
        skills.some((skill) => s.toLowerCase().includes(skill.toLowerCase()))
      );
      const score = Math.min(100, Math.round((matchingSkills.length / (skills.length || 1)) * 80 + Math.random() * 20));
      return { consultant, score };
    });
    setMatches(scoredConsultants.sort((a, b) => b.score - a.score).slice(0, 5));
    setIsMatching(false);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="particles-bg" />

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <CircularNavbar />

      <main className="relative z-10 pt-32 pb-24">
        <div className="container px-6">
          <SectionHeading
            badge="Synergy AI Labs"
            title="L'Innovation au Service de l'Humain"
            description="Découvrez notre suite d'outils intelligents conçus pour révolutionner le matching et la gestion de talents."
          />

          {/* AI Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 mt-12">
            {AI_SERVICES.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassCard
                    className="h-full flex flex-col group relative overflow-hidden cursor-pointer border-white/5 hover:border-primary/20 transition-all duration-500"
                    onClick={() => service.id === 'matching' && setActiveService('matching')}
                  >
                    {/* Background Gradient */}
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none", service.gradient)} />

                    {/* Floating Glow */}
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 blur-2xl rounded-full group-hover:bg-primary/10 transition-colors" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-6">
                        <div className={cn("w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6", service.color)}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {service.status === 'beta' && (
                            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">BETA</span>
                          )}
                          {service.status === 'upcoming' && (
                            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">SOON</span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-3">
                        {service.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {service.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/80 text-muted-foreground border border-border/50">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
                        DÉCOUVRIR L'OUTIL <ArrowRight className="w-3 h-3 ml-2" />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {activeService === 'matching' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md"
              >
                <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <GlassCard className="relative p-8" hover={false}>
                    <button
                      onClick={() => setActiveService(null)}
                      className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                        <Brain className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">AI Matching Engine</h3>
                        <p className="text-muted-foreground">Trouvez les meilleurs experts en un clic</p>
                      </div>
                    </div>

                    {/* Interactive Demo Content */}
                    <div className="space-y-6">
                      {/* Selected Skills */}
                      <div className="flex flex-wrap gap-2 min-h-[40px]">
                        {skills.map((skill) => (
                          <motion.span
                            key={skill}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                          >
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </motion.span>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addSkill(skillInput)}
                            placeholder="Tapez une compétence..."
                            className="futuristic-input pl-12"
                          />
                        </div>
                        <Button variant="outline" onClick={() => addSkill(skillInput)}>Ajouter</Button>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-3">Suggérés :</p>
                        <div className="flex flex-wrap gap-2">
                          {popularSkills.filter(s => !skills.includes(s)).slice(0, 6).map((skill) => (
                            <button
                              key={skill}
                              onClick={() => addSkill(skill)}
                              className="px-3 py-1.5 rounded-lg text-xs bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                            >
                              + {skill}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="hero"
                        size="lg"
                        className="w-full"
                        onClick={runMatching}
                        disabled={skills.length === 0 || isMatching}
                      >
                        {isMatching ? "Analyse IA en cours..." : "Lancer le Matching Digital"}
                      </Button>

                      {/* Results within Modal */}
                      {showResults && matches.length > 0 && (
                        <div className="pt-8 border-t border-border space-y-4">
                          <h4 className="font-bold">Top Matchings Profils</h4>
                          {matches.map((match, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                  {match.consultant.firstName[0]}
                                </div>
                                <div>
                                  <p className="font-semibold text-sm">{match.consultant.firstName} {match.consultant.lastName}</p>
                                  <p className="text-[10px] text-muted-foreground">{match.consultant.title}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-primary">{match.score}%</p>
                                <p className="text-[10px] text-muted-foreground">Match Score</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Capabilities Section */}
          <div className="mt-24 py-20 border-t border-border/50 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[150px] pointer-events-none" />
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold gradient-text mb-6 leading-tight">
                  Une Intelligence Collective au Service de vos Projets
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Notre écosystème IA ne remplace pas le recruteur, il l'augmente. En traitant des milliards de points de données, Synergy Hub identifie des signaux faibles que l'humain pourrait manquer.
                </p>
                <div className="space-y-6">
                  {[
                    { icon: Cpu, text: "Infrastructure serveurs GPU haute performance" },
                    { icon: Bot, text: "Agents IA personnalisés par secteur" },
                    { icon: Layers, text: "Modèles multi-modaux (Texte, Voix, Code)" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative z-10 p-8 glass-card border-primary/20 shadow-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                  <BarChart3 className="w-full h-64 text-primary/30 group-hover:text-primary/50 transition-all duration-700" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-8">
                    <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-glow-pulse" />
                    <h4 className="text-xl font-bold mb-2">99.8% Précision</h4>
                    <p className="text-sm text-muted-foreground">Taux de succès constaté sur nos derniers matchings IA.</p>
                  </div>
                </div>
                {/* Decorative orbits */}
                <div className="absolute -top-10 -right-10 w-40 h-40 border border-primary/10 rounded-full animate-spin-slow pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-accent/10 rounded-full animate-spin-reverse pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

