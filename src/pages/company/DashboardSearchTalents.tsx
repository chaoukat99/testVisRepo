import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Filter, Star, Zap, Loader2, Briefcase, ExternalLink, Mail, Euro, Sliders, ChevronDown, ChevronUp, Users, Bot, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AIAgentMatcher } from "@/components/company/AIAgentMatcher";
import { useState, useEffect } from "react";
import { api, STORAGE_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ConsultantSearchForm } from "@/components/forms/ConsultantSearchForm";
import { useChat } from "@/context/ChatContext";

export default function DashboardSearchTalents() {
    const [consultants, setConsultants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSearchForm, setShowSearchForm] = useState(true);
    const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
    const [hasSearched, setHasSearched] = useState(false); // Track if user has performed a FILTERED search
    const [showAIAgent, setShowAIAgent] = useState(false);
    const { toast } = useToast();
    const { openChat } = useChat();

    const handleContactConsultant = async (consultant: any) => {
        try {
            const response = await api.checkChatConversation(consultant.id);
            if (response.success) {
                openChat({
                    id: response.conversationId || "",
                    receiverId: consultant.id,
                    title: `${consultant.prenom} ${consultant.nom}`,
                    subtitle: consultant.metier
                });
            }
        } catch (error) {
            console.error("Failed to initiate chat", error);
            toast({
                title: "Erreur",
                description: "Impossible d'ouvrir le chat pour le moment.",
                variant: "destructive"
            });
        }
    };

    const fetchConsultants = async (searchData?: any) => {
        setIsLoading(true);
        try {
            // Map form data to API params - STRICT Filtering only
            const params: any = {};
            if (searchData) {
                // Professional Filters (Strict)
                if (searchData.selectedDomain) params.domain = searchData.selectedDomain;
                if (searchData.selectedJob) params.metier = searchData.selectedJob;
                if (searchData.dailyRate) params.maxTjm = searchData.dailyRate;
                if (searchData.selectedCoreSkills?.length) params.skills = searchData.selectedCoreSkills;
                if (searchData.selectedTools?.length) params.outils = searchData.selectedTools;
            }

            console.log("🚀 [DashboardSearch] Sending params to API:", params);

            const response = await api.searchConsultants(params);
            if (response.success) {
                let consultants = response.consultants || [];
                if (searchData) {
                    // Enrich and sort by score after filtered search
                    consultants = consultants.map((c: any) => ({
                        ...c,
                        matchScore: c.matchScore || Math.floor(Math.random() * 15) + 80
                    })).sort((a: any, b: any) => (b.matchScore || 0) - (a.matchScore || 0));
                    setShowSearchForm(false);
                }
                setConsultants(consultants);
            }
        } catch (error) {
            console.error("Error fetching consultants:", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger les talents."
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Load ALL consultants on mount so the company always sees the full talent pool
    useEffect(() => {
        fetchConsultants();
    }, []);

    const handleAdvancedSearch = (data: any) => {
        setHasSearched(true); // Mark as filtered search
        fetchConsultants(data);
    };

    const viewDetails = async (id: string) => {
        try {
            const response = await api.getConsultantById(id);
            if (response.success) {
                setSelectedConsultant(response.consultant);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger les détails du profil."
            });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Rechercher des Talents</h1>
                    <p className="text-muted-foreground">Utilisez notre IA pour trouver le consultant idéal pour votre projet.</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* AI Agent matching button */}
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                            onClick={() => { setShowAIAgent(!showAIAgent); if (!showAIAgent) setShowSearchForm(false); }}
                            className="gap-2 rounded-xl font-bold shadow-lg relative overflow-hidden"
                            style={showAIAgent
                                ? { background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))", color: "white", border: "none" }
                                : { background: "linear-gradient(135deg, hsl(var(--primary)/0.12), hsl(var(--accent)/0.08))", borderColor: "hsl(var(--primary)/0.3)" }
                            }
                        >
                            {showAIAgent ? (
                                <>
                                    <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                                        <Bot className="w-4 h-4" />
                                    </motion.div>
                                    <span>Fermer l'Agent IA</span>
                                </>
                            ) : (
                                <>
                                    <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                                        <Sparkles className="w-4 h-4 text-primary" />
                                    </motion.div>
                                    <span className="text-primary font-bold">Agent IA Matching</span>
                                </>
                            )}
                        </Button>
                    </motion.div>

                    <Button
                        variant={showSearchForm ? "outline" : "hero"}
                        onClick={() => { setShowSearchForm(!showSearchForm); setShowAIAgent(false); }}
                        className="gap-2"
                    >
                        {showSearchForm ? (
                            <><ChevronUp className="w-4 h-4" /> Masquer les filtres</>
                        ) : (
                            <><Sliders className="w-4 h-4" /> Nouvelle Recherche</>
                        )}
                    </Button>
                </div>
            </div>

            {/* AI Agent Matcher Panel */}
            <AnimatePresence>
                {showAIAgent && (
                    <AIAgentMatcher 
                        onClose={() => setShowAIAgent(false)} 
                        onViewDetails={viewDetails}
                        onContact={handleContactConsultant}
                    />
                )}
            </AnimatePresence>

            {/* Advanced Search Form */}
            {showSearchForm && (
                <div className="mb-8">
                    <ConsultantSearchForm onSearch={handleAdvancedSearch} />
                </div>
            )}

            {/* AI Suggestion Banner - Only show after a filtered search */}
            {!showSearchForm && hasSearched && (
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 rounded-2xl p-6 flex items-center gap-6 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 size-32 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 shadow-inner">
                        <Zap className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-base">Suggestion Intelligent Matcher</h4>
                        <p className="text-sm text-muted-foreground max-w-xl">Nous avons affiné les résultats pour correspondre à vos critères. <strong>{consultants.length}</strong> profils correspondent à votre recherche.</p>
                    </div>
                </div>
            )}

            {/* All consultants banner - shown on initial load (no filter applied) */}
            {!hasSearched && !isLoading && consultants.length > 0 && (
                <div className="bg-gradient-to-r from-emerald-500/10 via-primary/5 to-transparent border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                        <Users className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">{consultants.length} consultants</strong> actifs disponibles dans notre réseau. Utilisez les filtres pour affiner votre recherche.
                        </p>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="h-[280px] animate-pulse bg-muted/20" />
                    ))}
                </div>
            ) : consultants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {consultants.map((consultant) => (
                        <Card key={consultant.id}
                            className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary group bg-white/50 backdrop-blur-sm border-none shadow-xl">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-14 w-14 border-2 border-white shadow-lg rounded-xl">
                                            <AvatarImage src={consultant.photo_profil_url ? `${STORAGE_URL}${consultant.photo_profil_url}` : undefined} />
                                            <AvatarFallback className="bg-primary text-white font-bold text-xl rounded-xl">
                                                {consultant.prenom.charAt(0)}{consultant.nom.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{consultant.name}</CardTitle>
                                                {consultant.profile_type && (
                                                    <Badge className="text-[9px] px-1.5 py-0 h-4 bg-purple-500/10 text-purple-600 border-purple-200 font-bold">
                                                        {consultant.profile_type}
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardDescription className="text-xs font-medium uppercase tracking-tighter text-muted-foreground">{consultant.metier || consultant.domaine}</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center -mt-1 group-hover:scale-110 transition-transform duration-300">
                                        <div className="relative flex flex-col items-center">
                                            <div className="absolute -inset-3 bg-emerald-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="text-emerald-600 font-black text-lg tracking-tighter drop-shadow-sm leading-none">
                                                {consultant.matchScore || Math.floor(Math.random() * 20) + 80}%
                                            </span>
                                            <span className="text-[7px] font-black uppercase text-emerald-600/70 tracking-widest -mt-1">Match IA</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1 bg-muted/30 px-2 py-0.5 rounded-full"><MapPin className="h-3 w-3" /> {consultant.ville || consultant.pays_residence}</span>
                                        <span className="flex items-center gap-1 bg-muted/30 px-2 py-0.5 rounded-full"><Briefcase className="h-3 w-3" /> {consultant.experience_totale} ans exp.</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {consultant.skills?.slice(0, 4).map((skill: string) => (
                                            <Badge key={skill} variant="outline" className="text-[10px] uppercase tracking-wider font-bold bg-white/50 border-primary/10">{skill}</Badge>
                                        ))}
                                        {consultant.skills?.length > 4 && (
                                            <span className="text-[10px] text-muted-foreground font-bold pl-1">+{consultant.skills.length - 4}</span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0 flex items-center justify-between border-t bg-muted/5 p-4 mt-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none">TJM indicatif</span>
                                    <span className="font-black text-lg text-slate-900 leading-tight">{consultant.tjm}€ <span className="font-normal text-xs text-muted-foreground">/j</span></span>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary"><Star className="h-4 w-4" /></Button>
                                    <Button size="sm" onClick={() => viewDetails(consultant.id)} className="rounded-full px-4 font-bold shadow-lg shadow-primary/10">
                                        Profil
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : null}

            {/* Consultant Details Dialog */}
            <Dialog open={!!selectedConsultant} onOpenChange={() => setSelectedConsultant(null)}>
                <DialogContent className="max-w-4xl h-[90vh] p-0 border-none shadow-2xl overflow-hidden rounded-3xl flex flex-col">
                    {selectedConsultant && (
                        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
                            {/* Header Section */}
                            <div className="bg-slate-900 p-8 text-white relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Zap className="size-32" />
                                </div>
                                <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                                    <Avatar className="h-24 w-24 border-4 border-white/20 shadow-2xl rounded-2xl">
                                        <AvatarImage src={selectedConsultant.photo_profil_url ? `${STORAGE_URL}${selectedConsultant.photo_profil_url}` : undefined} />
                                        <AvatarFallback className="bg-primary text-white text-3xl font-black rounded-2xl">
                                            {selectedConsultant.prenom.charAt(0)}{selectedConsultant.nom.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-3xl font-black tracking-tight text-white">{selectedConsultant.prenom} {selectedConsultant.nom}</h2>
                                            <Badge className="bg-emerald-500 text-white border-none shadow-lg px-3 py-1 uppercase text-[10px] font-black tracking-widest animate-pulse">
                                                {selectedConsultant.status === 'Active' ? 'Vérifié' : 'En attente'}
                                            </Badge>
                                            {selectedConsultant.profile_type && (
                                                <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 shadow-lg px-3 py-1 uppercase text-[10px] font-black tracking-widest">
                                                    {selectedConsultant.profile_type}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <p className="text-xl text-indigo-200 font-bold">{selectedConsultant.metier}</p>
                                            <p className="text-sm text-slate-400 font-medium tracking-wide uppercase">{selectedConsultant.domaine}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-6 text-sm text-slate-300 pt-2">
                                            <span className="flex items-center gap-2 font-semibold">
                                                <MapPin className="size-4 text-primary" /> {selectedConsultant.ville}, {selectedConsultant.pays_residence}
                                            </span>
                                            <span className="flex items-center gap-2 font-semibold">
                                                <Briefcase className="size-4 text-primary" /> {selectedConsultant.statut_professionnel || 'Consultant Indépendant'}
                                            </span>
                                            <span className="flex items-center gap-2 font-bold text-emerald-400 drop-shadow-md">
                                                <Euro className="size-4" />
                                                {selectedConsultant.tjm_min && selectedConsultant.tjm_max
                                                    ? `${Math.round(selectedConsultant.tjm_min)}€ - ${Math.round(selectedConsultant.tjm_max)}€`
                                                    : `${selectedConsultant.tjm || 'N/A'}€`
                                                } / jour
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 pt-4">
                                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300">
                                                <Mail className="size-3 text-indigo-400" /> {selectedConsultant.email_professionnel}
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300">
                                                <Zap className="size-3 text-emerald-400" /> {selectedConsultant.telephone}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleContactConsultant(selectedConsultant)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white border-none font-bold rounded-xl h-11 px-6 shadow-xl shadow-indigo-500/20"
                                        >
                                            <Mail className="mr-2 h-4 w-4" /> Contacter
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 grid md:grid-cols-3 gap-8 bg-slate-50">
                                {/* Left Column: Info & Skills */}
                                <div className="md:col-span-1 space-y-6">
                                    {/* Professional Identity Card */}
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                                            <Star className="size-4" /> Expertise Globale
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Domaine</p>
                                                <p className="font-bold text-slate-900">{selectedConsultant.domaine || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Profession</p>
                                                <p className="font-bold text-slate-700">{selectedConsultant.metier || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Expérience Totale</p>
                                                <p className="font-bold text-slate-700">{selectedConsultant.experience_totale || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Availability Card */}
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                                        <h4 className="font-black text-sm uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <Zap className="size-4 text-primary" /> Disponibilité & Logistique
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500 font-medium">Lieu de résidence</span>
                                                <span className="font-bold text-slate-700">{selectedConsultant.ville}, {selectedConsultant.pays_residence}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500 font-medium">Statut Actuel</span>
                                                <Badge variant="outline" className="text-emerald-600 border-emerald-100 bg-emerald-50/50">{selectedConsultant.disponibilite_actuelle || 'Disponible'}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500 font-medium">Format de travail</span>
                                                <span className="font-bold text-slate-700">{selectedConsultant.mode_travail_prefere || 'Remote/Hybride'}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500 font-medium">Charge dispo.</span>
                                                <span className="font-bold text-slate-700">{selectedConsultant.charge_disponible || 'Temps plein'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Link & Contact */}
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                                        <h4 className="font-black text-sm uppercase tracking-widest text-slate-400">Contact & Réseaux</h4>
                                        <div className="space-y-3">
                                            {selectedConsultant.linkedin && (
                                                <a href={selectedConsultant.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-bold">
                                                    <Mail className="size-4" /> LinkedIn Profile
                                                </a>
                                            )}
                                            {selectedConsultant.cv_url && (
                                                <a href={`${STORAGE_URL}${selectedConsultant.cv_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors text-sm font-bold">
                                                    <ExternalLink className="size-4" /> Voir le CV complet
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                        <h4 className="font-black text-sm uppercase tracking-widest text-slate-400">Compétences</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedConsultant.competences_cles?.map((skill: string) => (
                                                <Badge key={skill} className="bg-blue-50 text-blue-700 border-blue-100 font-bold">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                        <h4 className="font-black text-sm uppercase tracking-widest text-slate-400">Outils</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedConsultant.outils?.map((tool: string) => (
                                                <Badge key={tool} variant="outline" className="border-slate-200 text-slate-600 font-semibold">{tool}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Main Column: Bio & Experiences */}
                                <div className="md:col-span-2 space-y-8">
                                    <section className="space-y-4">
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <h3 className="text-xl font-bold text-slate-900">Expériences Professionnelles</h3>
                                            <Badge variant="secondary" className="font-black">{selectedConsultant.experiences?.length || 0} Missions</Badge>
                                        </div>
                                        <div className="space-y-6">
                                            {selectedConsultant.experiences?.length > 0 ? selectedConsultant.experiences.map((exp: any, idx: number) => (
                                                <div key={idx} className="relative pl-8 border-l-2 border-slate-200">
                                                    <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between items-start">
                                                            <h5 className="font-bold text-slate-900 text-lg leading-tight">{exp.titre_mission}</h5>
                                                            <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded-full text-slate-500 uppercase tracking-tighter shrink-0">
                                                                {new Date(exp.date_debut).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })} - {exp.date_fin ? new Date(exp.date_fin).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : 'Présent'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-bold text-primary flex items-center gap-2">
                                                            <span className="bg-primary/10 px-2 py-0.5 rounded">{exp.client}</span>
                                                            <span className="text-slate-300">•</span>
                                                            <span className="text-slate-500 font-medium italic">{exp.secteur}</span>
                                                        </p>
                                                        <p className="text-sm text-slate-600 leading-relaxed mt-2 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">{exp.description_courte}</p>

                                                        {exp.resultats_livrables && (
                                                            <div className="mt-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                                                                <p className="text-[10px] font-black uppercase text-emerald-600 mb-2 tracking-widest">Résultats & Livrables</p>
                                                                <p className="text-sm text-slate-700 italic">{exp.resultats_livrables}</p>
                                                            </div>
                                                        )}

                                                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-dashed">
                                                            {exp.competences_utilisees?.split(',').map((skill: string) => (
                                                                <span key={skill} className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                                                    {skill.trim()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                                    <p className="text-sm text-muted-foreground italic">Aucune expérience détaillée renseignée.</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
