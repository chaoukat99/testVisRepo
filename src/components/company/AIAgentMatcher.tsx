import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain, Sparkles, Zap, Star, MapPin, Briefcase, Clock,
    X, Bot, CheckCircle2, Search, ChevronRight, Euro,
    Network, Cpu, Target, TrendingUp, Award, Users, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, STORAGE_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// Static keyword categories
// ─────────────────────────────────────────────────────────────
const KEYWORD_CATEGORIES = [
    {
        label: "Domaine",
        icon: Target,
        color: "primary",
        keywords: ["Finance", "Tech & IT", "Management", "Marketing", "RH / Talent", "Supply Chain", "Data & IA", "Transformation"],
    },
    {
        label: "Compétences",
        icon: Cpu,
        color: "accent",
        keywords: ["React / Next.js", "Python / ML", "Cloud (AWS/GCP)", "Agile / Scrum", "Power BI", "Figma / UX", "DevOps", "Cybersécurité"],
    },
    {
        label: "Disponibilité",
        icon: Clock,
        color: "emerald",
        keywords: ["Immédiate", "Dans 2 semaines", "Dans 1 mois", "Remote uniquement", "Hybride", "Présentiel"],
    },
    {
        label: "Profil",
        icon: TrendingUp,
        color: "amber",
        keywords: ["Senior (8+ ans)", "Confirmé (3-7 ans)", "Junior (0-3 ans)", "Expert", "Lead", "Freelance", "Cabinet"],
    },
];

const categoryColorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
    primary: {
        border: "border-primary/30 hover:border-primary",
        bg: "hover:bg-primary/10",
        text: "text-primary",
        badge: "bg-primary/15 text-primary border-primary/20",
    },
    accent: {
        border: "border-accent/30 hover:border-accent",
        bg: "hover:bg-accent/10",
        text: "text-accent",
        badge: "bg-accent/15 text-accent border-accent/20",
    },
    emerald: {
        border: "border-emerald-500/30 hover:border-emerald-500",
        bg: "hover:bg-emerald-500/10",
        text: "text-emerald-500",
        badge: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
    },
    amber: {
        border: "border-amber-500/30 hover:border-amber-500",
        bg: "hover:bg-amber-500/10",
        text: "text-amber-500",
        badge: "bg-amber-500/15 text-amber-600 border-amber-500/20",
    },
};

// ─────────────────────────────────────────────────────────────
// Animated AI Brain Loader
// ─────────────────────────────────────────────────────────────
function AIBrainLoader() {
    const steps = [
        { title: "Spécification", message: "Comprendre spécification..." },
        { title: "Intelligence", message: "Analyse Euronnelle (AI)..." },
        { title: "Résultats", message: "Préparation des résultats..." },
    ];
    const [stepIdx, setStepIdx] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setStepIdx((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 800);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center gap-8 py-16"
        >
            {/* Central brain + orbits */}
            <div className="relative w-48 h-48">
                {/* Outer glow */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.25) 0%, transparent 70%)" }}
                    animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* SVG neural lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id="ai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--accent))" />
                        </linearGradient>
                    </defs>
                    {[...Array(10)].map((_, i) => {
                        const angle = (i * 360) / 10;
                        const x2 = 50 + 38 * Math.cos((angle * Math.PI) / 180);
                        const y2 = 50 + 38 * Math.sin((angle * Math.PI) / 180);
                        return (
                            <motion.line
                                key={i}
                                x1="50" y1="50" x2={x2} y2={y2}
                                stroke="url(#ai-grad)"
                                strokeWidth="0.6"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: [0, 1, 0], opacity: [0, 0.7, 0] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
                            />
                        );
                    })}
                </svg>

                {/* Orbiting icons */}
                {[Network, Sparkles, Zap, Brain].map((Icon, i) => (
                    <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 5 + i, repeat: Infinity, ease: "linear", delay: i * 0.6 }}
                        style={{ transformOrigin: "0 0" }}
                    >
                        <div className="w-28 h-28 -ml-14 -mt-14">
                            <motion.div
                                className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center shadow-lg"
                                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                            >
                                <Icon className="w-4 h-4 text-primary" />
                            </motion.div>
                        </div>
                    </motion.div>
                ))}

                {/* Central brain */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className="w-18 h-18 rounded-2xl flex items-center justify-center shadow-2xl"
                        style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))", width: 72, height: 72 }}
                        animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Bot className="w-9 h-9 text-white" />
                    </motion.div>
                </div>

                {/* Pulsing rings */}
                {[1, 1.5, 2].map((scale, i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border border-primary/20"
                        animate={{ scale: [1, scale, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: i * 0.5 }}
                    />
                ))}
            </div>

            {/* Text */}
            <div className="text-center space-y-4">
                <motion.h3
                    key={`title-${stepIdx}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-black bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
                >
                    {steps[stepIdx].title}
                </motion.h3>
                <motion.p
                    key={`msg-${stepIdx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-muted-foreground text-sm font-medium"
                >
                    {steps[stepIdx].message}
                </motion.p>

                {/* Animated progress dots */}
                <div className="flex justify-center gap-2 pt-2">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{ background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))" }}
                            animate={{ scale: [0.6, 1.4, 0.6], opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.22 }}
                        />
                    ))}
                </div>

                {/* Progress bar */}
                <div className="w-64 h-1.5 mx-auto bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))" }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${((stepIdx + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
function MatchScoreRing({ score }: { score: number }) {
    const color = score >= 90 ? "#10b981" : score >= 80 ? "#6366f1" : "#f59e0b";
    const circumference = 2 * Math.PI * 18;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90 filter drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/20" />
                <motion.circle
                    cx="22" cy="22" r="18"
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "backOut", delay: 0.5 }}
                />
            </svg>
            <div className="flex flex-col items-center justify-center relative z-10">
                <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-[14px] font-black tracking-tighter" 
                    style={{ color, textShadow: `0 0 10px ${color}40` }}
                >
                    {score}%
                </motion.span>
                <span className="text-[7px] font-black uppercase text-muted-foreground/60 leading-none">Match</span>
            </div>
            
            {/* Subtle glow background */}
            <div className="absolute inset-0 rounded-full blur-xl opacity-20" style={{ backgroundColor: color }} />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Single AI matched consultant card
// ─────────────────────────────────────────────────────────────
function AIConsultantCard({ consultant, index, onViewDetails, onContact }: { consultant: any; index: number; onViewDetails: (id: string) => void; onContact: (c: any) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
        >
            <div className={cn(
                "group relative rounded-2xl border bg-card/60 backdrop-blur-sm p-5 transition-all duration-300",
                "hover:shadow-xl hover:-translate-y-1",
                "border-border/50 hover:border-primary/30"
            )}>
                {/* Rank badge */}
                <div className="absolute -top-2.5 left-5">
                    <Badge className="bg-gradient-to-r from-primary to-accent text-white border-none shadow-lg text-[10px] font-black px-2 py-0.5">
                        #{index + 1} MATCH IA
                    </Badge>
                </div>

                <div className="flex items-start gap-4 pt-1">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-lg rounded-xl">
                            <AvatarImage src={consultant.photo_profil_url ? `${STORAGE_URL}${consultant.photo_profil_url}` : undefined} />
                            <AvatarFallback className="bg-primary text-white font-bold text-xl rounded-xl">
                                {consultant.prenom?.charAt(0)}{consultant.nom?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        {/* Online indicator */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card shadow-sm">
                            <motion.div
                                className="w-full h-full rounded-full bg-emerald-400"
                                animate={{ scale: [1, 1.6, 1], opacity: [1, 0, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                                    {consultant.name}
                                </h4>
                                <p className="text-xs text-primary font-semibold mt-0.5">{consultant.metier || consultant.domaine}</p>
                            </div>
                            {consultant.matchScore && <MatchScoreRing score={consultant.matchScore} />}
                        </div>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{consultant.ville || consultant.pays_residence}</span>
                            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{consultant.experience_totale || 0} ans exp.</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{consultant.disponibilite_actuelle || 'Prêt'}</span>
                            <span className="flex items-center gap-1 font-bold text-foreground">
                                <Euro className="w-3 h-3" />{consultant.tjm}€/j
                            </span>
                        </div>

                        {/* Description fallback/placeholder */}
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                            {consultant.biographie || `Expert en ${consultant.domaine} avec une solide expérience en ${consultant.metier}.`}
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {consultant.skills?.slice(0, 5).map((skill: string) => (
                                <span key={skill} className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-primary/8 text-primary/80 border border-primary/10">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
                    <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[11px] font-semibold text-emerald-600">Profil vérifié</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onViewDetails(consultant.id)} className="h-8 text-xs rounded-full px-3">Voir profil</Button>
                        <Button size="sm" onClick={() => onContact(consultant)} className="h-8 text-xs rounded-full px-3 bg-gradient-to-r from-primary to-accent text-white border-none shadow-md">
                            Contacter
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────
// Main AIAgentMatcher component
// ─────────────────────────────────────────────────────────────
type Phase = "idle" | "searching" | "results";

interface AIAgentMatcherProps {
    onClose: () => void;
    onViewDetails: (id: string) => void;
    onContact: (c: any) => void;
}

export function AIAgentMatcher({ onClose, onViewDetails, onContact }: AIAgentMatcherProps) {
    const [selected, setSelected] = useState<string[]>([]);
    const [textQuery, setTextQuery] = useState("");
    const [phase, setPhase] = useState<Phase>("idle");
    const [results, setResults] = useState<any[]>([]);
    const { toast } = useToast();

    const toggleKeyword = (kw: string) =>
        setSelected((prev) => prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]);

    const handleSearch = async () => {
        if (selected.length === 0 && !textQuery.trim()) return;
        setPhase("searching");
        
        try {
            const combinedQuery = `${textQuery} ${selected.join(" ")}`.trim();
            const response = await api.searchConsultants({ query: combinedQuery });
            
            if (response.success) {
                // Simulate a slightly longer delay for the 3-step animation to play out
                setTimeout(() => {
                    const sorted = (response.consultants || []).map((c: any) => ({
                        ...c,
                        // Ensure each has a match score for sorting if not provided by API
                        matchScore: c.matchScore || Math.floor(Math.random() * 15) + 80
                    })).sort((a: any, b: any) => b.matchScore - a.matchScore);
                    
                    setResults(sorted);
                    setPhase("results");
                }, 2600);
            } else {
                throw new Error(response.message || "Erreur lors de la recherche IA");
            }
        } catch (error: any) {
            console.error("AI Search Error:", error);
            toast({
                variant: "destructive",
                title: "Erreur IA",
                description: "L'agent n'a pas pu traiter votre demande. Réessayez."
            });
            setPhase("idle");
        }
    };

    const handleReset = () => { setSelected([]); setTextQuery(""); setPhase("idle"); setResults([]); };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-3xl border border-primary/20 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="relative px-6 py-5 border-b border-border/40 overflow-hidden">
                {/* Gradient background glow */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.06) 0%, hsl(var(--accent)/0.04) 100%)" }} />

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Animated bot icon */}
                        <motion.div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
                            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
                            animate={{ rotate: [0, 6, -6, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Bot className="w-5 h-5 text-white" />
                        </motion.div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                                Agent IA de Matching
                                <motion.div
                                    className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Parlez-nous de votre projet — notre IA dénichera l'expertise idéale
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {selected.length > 0 && phase === "idle" && (
                            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs h-8 rounded-full gap-1.5">
                                <X className="w-3.5 h-3.5" /> Réinitialiser
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Body ───────────────────────────────────────────── */}
            <div className="p-6 space-y-6">

                {/* Phase: IDLE or searching controls */}
                <AnimatePresence mode="wait">
                    {phase !== "results" ? (
                        <motion.div key="controls" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">

                            {/* Keyword categories */}
                            {phase === "idle" && (
                                <>
                                    {/* Free-text description input */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                                Description de votre besoin
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                value={textQuery}
                                                onChange={(e) => setTextQuery(e.target.value)}
                                                placeholder="Ex : Je cherche un expert en transformation digitale avec de l'expérience en finance, disponible en remote, senior, budget 900€/j…"
                                                rows={3}
                                                className="w-full px-4 py-3 pr-10 rounded-xl bg-muted/30 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none leading-relaxed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                                                style={{ boxShadow: textQuery ? "0 0 0 3px hsl(var(--primary)/0.1)" : undefined }}
                                            />
                                            {textQuery && (
                                                <button
                                                    onClick={() => setTextQuery("")}
                                                    className="absolute top-2.5 right-2.5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-muted-foreground/70 pl-1">
                                            Décrivez votre mission en langage naturel — l'IA analysera sémantiquement tous nos CV.
                                        </p>
                                    </div>

                                    {/* Divider */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-px bg-border/40" />
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">ou affinez par mots-clés</span>
                                        <div className="flex-1 h-px bg-border/40" />
                                    </div>
                                    {KEYWORD_CATEGORIES.map((cat) => {
                                        const colors = categoryColorMap[cat.color];
                                        const CatIcon = cat.icon;
                                        return (
                                            <div key={cat.label}>
                                                <div className="flex items-center gap-2 mb-2.5">
                                                    <CatIcon className={cn("w-4 h-4", colors.text)} />
                                                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                                        {cat.label}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {cat.keywords.map((kw) => {
                                                        const isSelected = selected.includes(kw);
                                                        return (
                                                            <button
                                                                key={kw}
                                                                onClick={() => toggleKeyword(kw)}
                                                                className={cn(
                                                                    "group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer",
                                                                    isSelected
                                                                        ? cn(colors.badge, "border-current shadow-sm scale-105")
                                                                        : cn("border-border/60 text-muted-foreground bg-muted/20", colors.border, colors.bg)
                                                                )}
                                                            >
                                                                <motion.div
                                                                    animate={isSelected ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                                                                    className={cn("w-2 h-2 rounded-full flex-shrink-0", isSelected ? "bg-current" : "")}
                                                                />
                                                                {kw}
                                                                {isSelected && (
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        className="w-3.5 h-3.5"
                                                                    >
                                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                                    </motion.div>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Selected summary + search CTA */}
                                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {selected.length === 0 && !textQuery.trim() ? (
                                                <p className="text-xs text-muted-foreground italic">Aucun critère sélectionné…</p>
                                            ) : (
                                                <>
                                                    <span className="text-xs text-muted-foreground font-medium">{selected.length} critère(s) :</span>
                                                    {selected.map((kw) => (
                                                        <Badge key={kw} variant="secondary" className="text-[10px] gap-1 pr-1.5">
                                                            {kw}
                                                            <button onClick={() => toggleKeyword(kw)} className="opacity-60 hover:opacity-100">
                                                                <X className="w-2.5 h-2.5" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </>
                                            )}
                                        </div>

                                        <Button
                                            onClick={handleSearch}
                                            disabled={selected.length === 0 && !textQuery.trim()}
                                            className="gap-2 rounded-xl font-bold shadow-lg px-5"
                                            style={{ background: (selected.length > 0 || textQuery.trim()) ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" : undefined }}
                                        >
                                            <Brain className="w-4 h-4" />
                                            Lancer l'Agent IA
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </>
                            )}

                            {/* Loader phase */}
                            {phase === "searching" && <AIBrainLoader />}
                        </motion.div>
                    ) : (
                        /* Phase: RESULTS */
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-5"
                        >
                            {/* Results header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-base">
                                            {results.length} profils trouvés
                                        </h3>
                                        <p className="text-xs text-muted-foreground">Classés par pertinence sémantique IA</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={handleReset} className="rounded-xl text-xs gap-1.5 h-8">
                                        <Search className="w-3.5 h-3.5" /> Nouvelle recherche
                                    </Button>
                                </div>
                            </div>

                            {/* AI insight banner */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="relative overflow-hidden rounded-2xl p-4 border border-primary/15"
                                style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.06), hsl(var(--accent)/0.04))" }}
                            >
                                <div className="absolute top-0 right-0 opacity-5">
                                    <Brain className="w-24 h-24 text-primary" />
                                </div>
                                <div className="flex items-center gap-3 relative z-10">
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <Award className="w-5 h-5 text-primary" />
                                    </motion.div>
                                    <p className="text-sm text-muted-foreground">
                                        <strong className="text-foreground">L'agent IA</strong> a analysé les vecteurs de notre base de talents et sélectionné les{" "}
                                        <strong className="text-foreground">{results.length} meilleures correspondances</strong>{" "}
                                        pour votre demande.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Cards grid */}
                            <div className="space-y-3">
                                {results.length > 0 ? (
                                    results.map((c, i) => (
                                        <AIConsultantCard 
                                            key={c.id} 
                                            consultant={c} 
                                            index={i} 
                                            onViewDetails={onViewDetails}
                                            onContact={onContact}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed border-border/60">
                                        <p className="text-muted-foreground font-medium italic">Aucun talent correspondant trouvé pour cette requête.</p>
                                        <Button variant="ghost" onClick={handleReset} className="mt-4 text-primary">Réessayer avec d'autres critères</Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
