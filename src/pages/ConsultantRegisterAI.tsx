import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot, CheckCircle2, ArrowRight, User, Settings, Network, Share2, Upload, File as FileIcon, EyeOff, Eye, Loader2, Sparkles, Server, Check, Edit2, Shield
} from "lucide-react";
import { CircularNavbar } from "@/components/layout/CircularNavbar";
import { CountryCitySelector } from "@/components/forms/CountryCitySelector";
import { SkillSelector } from "@/components/forms/SkillSelector";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTaxonomy } from "@/hooks/useTaxonomy";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
interface FormData {
    profile_type: string;
    prenom: string;
    nom: string;
    email_professionnel: string;
    telephone: string;
    mot_de_passe: string;
    confirm_password: string;
    photo_profil: File | null;
    pays_residence: string;
    ville: string;
    adresse_complete: string;
    statut_professionnel: string;
    annee_debut_activite: string;
    site_web: string;
    linkedin: string;
    identifiant_fiscal: string;
    domaine: string;
    metier: string;
    outils: string;
    competences_cles: string;
    experience_totale: string;
    cv: File | null;
    disponibilite_actuelle: string;
    charge_disponible: string;
    mode_travail_prefere: string;
    tjm: string;
    profil_public: boolean;
    autorisation_matching_ia: boolean;
    cgu_acceptees: boolean;
}

interface Question {
    key: keyof FormData;
    title: string;
    question: string;
    type: "text" | "email" | "password" | "tel" | "number" | "select" | "file" | "boolean" | "multitext";
    options?: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
    icon?: React.ReactNode;
    dynamic?: boolean;
}

const QUESTIONS: Question[] = [
    { key: "profile_type", title: "Profil", question: "Quel est votre type de profil ?", type: "select", options: [{ value: "Consultant", label: "Consultant" }, { value: "Freelance", label: "Freelance" }, { value: "Manager de Transit", label: "Manager de Transition" }], required: true, icon: <User className="w-4 h-4" /> },
    { key: "prenom", title: "Prénom", question: "Quel est votre prénom ?", type: "text", required: true, icon: <User className="w-4 h-4" /> },
    { key: "nom", title: "Nom", question: "Et votre nom de famille ?", type: "text", required: true, icon: <User className="w-4 h-4" /> },
    { key: "email_professionnel", title: "Email", question: "Votre email professionnel ?", type: "email", required: true, icon: <Server className="w-4 h-4" /> },
    { key: "telephone", title: "Téléphone", question: "Votre numéro de téléphone ?", type: "tel", required: true, icon: <Server className="w-4 h-4" /> },
    { key: "mot_de_passe", title: "Mot de passe", question: "Choisissez un mot de passe", type: "password", required: true, icon: <Shield className="w-4 h-4" /> },
    { key: "confirm_password", title: "Confirmer", question: "Confirmez le mot de passe", type: "password", required: true, icon: <Shield className="w-4 h-4" /> },
    { key: "photo_profil", title: "Avatar", question: "Votre photo de profil (optionnel)", type: "file", icon: <User className="w-4 h-4" /> },
    { key: "pays_residence", title: "Pays/Ville", question: "Où résidez-vous ?", type: "location", required: true, icon: <Network className="w-4 h-4" /> },
    { key: "adresse_complete", title: "Adresse", question: "Votre adresse complète (optionnel)", type: "text", icon: <Network className="w-4 h-4" /> },
    { key: "statut_professionnel", title: "Statut", question: "Quel est votre statut ?", type: "select", options: [{ value: "Freelance", label: "Freelance" }, { value: "Auto-entrepreneur", label: "Auto-entrepreneur" }, { value: "SASU", label: "SASU" }, { value: "EURL", label: "EURL" }, { value: "Portage salarial", label: "Portage salarial" }, { value: "Cabinet", label: "Cabinet" }, { value: "Autre", label: "Autre" }], required: true, icon: <Settings className="w-4 h-4" /> },
    { key: "annee_debut_activite", title: "Début d'activité", question: "Année de début d'activité ?", type: "number", icon: <Settings className="w-4 h-4" /> },
    { key: "site_web", title: "Site web", question: "Avez-vous un site web ?", type: "text", icon: <Share2 className="w-4 h-4" /> },
    { key: "linkedin", title: "LinkedIn", question: "Votre profil LinkedIn ?", type: "text", icon: <Share2 className="w-4 h-4" /> },
    { key: "identifiant_fiscal", title: "ID Fiscal", question: "Identifiant fiscal (SIRET...)", type: "text", icon: <Shield className="w-4 h-4" /> },
    { key: "domaine", title: "Domaine", question: "Votre domaine d'expertise ?", type: "select", dynamic: true, required: true, icon: <Server className="w-4 h-4" /> },
    { key: "metier", title: "Métier", question: "Votre spécialité/métier ?", type: "select", dynamic: true, required: true, icon: <Server className="w-4 h-4" /> },
    { key: "outils", title: "Outils", question: "Outils maîtrisés", type: "skills", icon: <Settings className="w-4 h-4" /> },
    { key: "competences_cles", title: "Compétences", question: "Vos compétences clés", type: "skills", icon: <Settings className="w-4 h-4" /> },
    { key: "experience_totale", title: "Expérience", question: "Années d'expérience au total ?", type: "number", required: true, icon: <Settings className="w-4 h-4" /> },
    { key: "cv", title: "CV", question: "Joindre votre CV", type: "file", icon: <FileIcon className="w-4 h-4" /> },
    { key: "disponibilite_actuelle", title: "Disponibilité", question: "Disponibilité actuelle ?", type: "select", options: [{ value: "Disponible immédiatement", label: "Immédiate" }, { value: "Disponible à partir de", label: "À date" }, { value: "En mission", label: "En mission" }], required: true, icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: "charge_disponible", title: "Charge", question: "Charge de travail assurée ?", type: "select", options: [{ value: "1", label: "1j/semaine" }, { value: "2-3", label: "2-3j/semaine" }, { value: "4-5", label: "4-5j/semaine" }, { value: "Temps plein", label: "Temps plein" }], icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: "mode_travail_prefere", title: "Mode de travail", question: "Mode préféré (Remote, ...)", type: "select", options: [{ value: "Remote", label: "Remote" }, { value: "Hybride", label: "Hybride" }, { value: "Sur site", label: "Sur site" }], icon: <Network className="w-4 h-4" /> },
    { key: "tjm", title: "TJM", question: "Votre TJM (en €) ?", type: "number", icon: <Server className="w-4 h-4" /> },
    { key: "profil_public", title: "Profil visible", question: "Profil public ?", type: "boolean", icon: <Eye className="w-4 h-4" /> },
    { key: "autorisation_matching_ia", title: "Matching IA", question: "Autoriser l'utilisation de vos données par l'IA ?", type: "boolean", icon: <Bot className="w-4 h-4" /> },
];

export default function ConsultantRegisterAI() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { taxonomy } = useTaxonomy();
    const bottomRef = useRef<HTMLDivElement>(null);

    const [questionIndex, setQuestionIndex] = useState(0);
    const [currentInput, setCurrentInput] = useState<any>("");
    const [showVerification, setShowVerification] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        profile_type: "", prenom: "", nom: "", email_professionnel: "", telephone: "", mot_de_passe: "", confirm_password: "", photo_profil: null, pays_residence: "", ville: "", adresse_complete: "", statut_professionnel: "", annee_debut_activite: "", site_web: "", linkedin: "", identifiant_fiscal: "", domaine: "", metier: "", outils: "", competences_cles: "", experience_totale: "", cv: null, disponibilite_actuelle: "", charge_disponible: "", mode_travail_prefere: "", tjm: "", profil_public: true, autorisation_matching_ia: true, cgu_acceptees: false,
    });

    useEffect(() => {
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    }, [questionIndex, showVerification]);

    const handleNext = () => {
        const q = QUESTIONS[questionIndex];
        const val = currentInput;

        if (q.type === "location") {
            if (q.required && (!formData.pays_residence || !formData.ville)) {
                toast({ variant: "destructive", title: "Requis", description: "Le pays et la ville sont obligatoires." });
                return;
            }
        } else if (q.required && (val === "" || val === null || val === undefined)) {
            toast({ variant: "destructive", title: "Requis", description: "Ce champ est obligatoire." });
            return;
        }
        if (q.key === "confirm_password" && val !== formData.mot_de_passe) {
            toast({ variant: "destructive", title: "Erreur", description: "Les mots de passe ne correspondent pas." }); return;
        }

        if (q.type !== "location") {
            setFormData(prev => ({ ...prev, [q.key]: val }));
        }
        setCurrentInput("");

        if (questionIndex + 1 >= QUESTIONS.length) {
            setShowVerification(true);
        } else {
            setQuestionIndex(questionIndex + 1);
        }
    };

    const handleEdit = (index: number) => {
        setQuestionIndex(index);
        setShowVerification(false);
        setCurrentInput(formData[QUESTIONS[index].key]);
    };

    const handleFinalSubmit = async () => {
        if (!formData.cgu_acceptees) return toast({ variant: "destructive", title: "Requis", description: "Acceptez les CGU." });
        
        setIsSubmitting(true);
        try {
            const fd = new FormData();
            Object.keys(formData).forEach(k => {
                if (k === "photo_profil" || k === "cv") {
                    if (formData[k as keyof FormData]) fd.append(k, formData[k as keyof FormData] as File);
                } else if (k !== "confirm_password" && k !== "cgu_acceptees") {
                    fd.append(k, String(formData[k as keyof FormData]));
                }
            });
            const res = await api.registerConsultant(fd);
            if (res.success) {
                if (res.token) localStorage.setItem('token', res.token);
                if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
                setIsSubmitted(true);
            } else throw new Error(res.message);
        } catch {
            toast({ variant: "destructive", title: "Erreur", description: "Vérifiez vos informations." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground px-6 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <h2 className="text-3xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">Inscription Réussie !</h2>
                <p className="text-muted-foreground mb-8 max-w-md">Félicitations ! Votre profil est désormais <strong>actif</strong> et prêt à être matché avec les meilleures missions.</p>
                <div className="flex gap-4">
                    <a href="/consultant/dashboard" className="px-8 py-3 bg-foreground text-background rounded-xl font-bold hover:scale-105 transition-all shadow-xl">Accéder à mon Dashboard</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-violet-500/30">
            {/* Background Grid */}
            <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(128,128,128,0.12) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            
            <CircularNavbar />

            {/* Topbar Layout */}
            <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-40 flex items-center px-6">
                <div className="flex items-center gap-3 text-sm">
                    <Bot className="w-5 h-5 text-violet-400" />
                    <span className="text-muted-foreground">aria-registration</span>
                    <span className="text-muted-foreground/40">/</span>
                    <span className="text-foreground font-medium">production</span>
                </div>
                <div className="ml-auto flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="hover:text-foreground cursor-pointer transition-colors">Architecture</span>
                    <span className="hover:text-foreground cursor-pointer transition-colors">Settings</span>
                    <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md bg-muted/30 ml-4">
                        <span className="text-xs uppercase font-medium">Progression</span>
                        <span className="text-foreground font-semibold">{Math.round((questionIndex / QUESTIONS.length) * 100)}%</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-40 min-h-screen flex flex-col items-center overflow-x-hidden">
                <div className="w-full max-w-[1600px] px-6 md:px-12 flex flex-wrap gap-x-2 md:gap-x-4 gap-y-10 items-start justify-center">
                    
                    {/* Render Completed Questions */}
                    {QUESTIONS.map((q, i) => {
                        if (i >= questionIndex || showVerification) return null;
                        
                        let display: React.ReactNode = "(passé)";
                        
                        if (q.type === "location") {
                            display = `${formData.pays_residence || ''} - ${formData.ville || ''}`;
                        } else {
                            const val = formData[q.key];
                            if (val instanceof File) {
                                display = val.type.startsWith('image/') 
                                    ? <img src={URL.createObjectURL(val)} alt="upload" className="h-6 w-auto rounded object-cover" /> 
                                    : val.name;
                            } else if (typeof val === 'boolean') {
                                display = val ? 'Oui' : 'Non';
                            } else if (Array.isArray(val)) {
                                display = val.join(', ') || "(passé)";
                            } else if (q.type === "password") {
                                display = "••••••••";
                            } else if (val) {
                                display = val as string;
                            }
                        }
                        
                        return (
                            <React.Fragment key={q.key}>
                                <motion.div 
                                    drag
                                    dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                    className="bg-card border border-border rounded-lg w-64 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:border-violet-500/50 transition-colors cursor-grab active:cursor-grabbing relative flex items-center p-3 gap-3 z-10 shrink-0"
                                    onDoubleClick={() => handleEdit(i)}
                                >
                                    {/* n8n style node connectors - Horizontal */}
                                    <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-background border border-border rounded-full" />
                                    <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-background border border-border rounded-full" />

                                    {/* Icon Box */}
                                    <div className="w-8 h-8 rounded bg-muted border border-border flex items-center justify-center text-violet-500 shrink-0 pointer-events-none">
                                        {q.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col flex-1 min-w-0 justify-center pointer-events-none">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-bold text-foreground tracking-widest uppercase">{q.title}</span>
                                        </div>
                                        <span className="text-[12px] text-muted-foreground truncate mt-0.5">{display}</span>
                                    </div>
                                </motion.div>

                                {/* Horizontal Connector */}
                                <div className="hidden sm:block w-4 md:w-8 h-px bg-gradient-to-r from-border to-transparent my-auto shrink-0" />
                            </React.Fragment>
                        );
                    })}

                    {/* Render Active Question */}
                    {!showVerification && QUESTIONS[questionIndex] && (
                        <div className="flex items-center relative z-20 shrink-0" ref={bottomRef}>
                            <motion.div 
                                drag
                                dragConstraints={{ left: -15, right: 15, top: -15, bottom: 15 }}
                                initial={{ opacity: 0, scale: 0.95, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }}
                                className="bg-card border border-violet-500 rounded-lg w-[320px] md:w-[380px] shadow-[0_0_40px_rgba(139,92,246,0.15)] relative flex flex-col overflow-visible cursor-grab active:cursor-grabbing"
                            >
                                {/* Active input connector */}
                                <div className="absolute top-10 left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-violet-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />

                                {/* Header */}
                                <div className="px-5 py-4 border-b border-border flex items-center gap-4 bg-gradient-to-r from-violet-500/10 to-transparent rounded-t-lg pointer-events-none">
                                    {/* AI Robot Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-full animate-pulse" />
                                        <div className="relative w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-cyan-500 via-violet-500 to-blue-500 shadow-lg">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-background">
                                                <img
                                                    src="/images/avatar.png"
                                                    alt="AI"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-violet-500 text-xs font-bold">AI</div>';
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-background flex items-center justify-center border border-background">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">{QUESTIONS[questionIndex].title}</span>
                                        <h3 className="text-[15px] font-medium text-foreground break-words mt-0.5">{QUESTIONS[questionIndex].question}</h3>
                                    </div>
                                </div>
                                
                                {/* Input Body */}
                                <div className="p-5 bg-muted/30 rounded-b-lg">
                                    <InputRenderer 
                                        q={QUESTIONS[questionIndex]} 
                                        val={currentInput} 
                                        setVal={setCurrentInput} 
                                        onEnter={handleNext} 
                                        taxonomy={taxonomy}
                                        domaine={formData.domaine}
                                        metier={formData.metier}
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                    <div className="mt-5 flex items-center justify-between">
                                        {!QUESTIONS[questionIndex].required && (
                                            <button onClick={() => { setCurrentInput(""); handleNext(); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Passer (Optionnel)</button>
                                        )}
                                        <button 
                                            onClick={handleNext} 
                                            className="ml-auto px-6 py-2.5 bg-foreground text-background text-sm font-bold rounded hover:opacity-90 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                        >
                                            Éxecuter Noeud <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                            <div className="hidden sm:block w-32 h-px bg-gradient-to-r from-border to-transparent shrink-0 opacity-50" />
                        </div>
                    )}

                    {/* Final Summary Layout */}
                    {showVerification && (
                        <div className="w-full flex flex-col items-center relative z-20" ref={bottomRef}>
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="bg-card border border-emerald-500/30 rounded-xl w-full max-w-3xl shadow-[0_0_30px_rgba(16,185,129,0.08)] overflow-hidden p-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                    <h3 className="text-xl font-medium text-foreground">Validation du Profil</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {QUESTIONS.map((q, i) => {
                                        let display: any;
                                        if (q.type === "location") {
                                            display = `${formData.pays_residence || ''} - ${formData.ville || ''}`;
                                        } else {
                                            const val = formData[q.key];
                                            display = val instanceof File ? val.name : (typeof val === 'boolean' ? (val ? 'Oui' : 'Non') : val);
                                            if (Array.isArray(val)) display = val.join(', ');
                                        }
                                        if (q.type === "password" || !display || display === " - ") return null;
                                        return (
                                            <div key={q.key} className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border group">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{q.title}</span>
                                                    <span className="text-sm text-foreground truncate max-w-[200px]">{display}</span>
                                                </div>
                                                <button onClick={() => handleEdit(i)} className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-foreground transition-all"><Edit2 className="w-4 h-4" /></button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 pt-6 border-t border-border flex flex-col items-center">
                                    <label className="flex items-center gap-3 cursor-pointer mb-6 group w-full justify-center">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only" 
                                            checked={formData.cgu_acceptees}
                                            onChange={() => setFormData(prev => ({...prev, cgu_acceptees: !prev.cgu_acceptees}))} 
                                        />
                                        <div className={`w-5 h-5 shrink-0 rounded border flex items-center justify-center transition-all ${formData.cgu_acceptees ? 'bg-emerald-500 border-emerald-500' : 'bg-transparent border-border group-hover:border-foreground/40'}`}>
                                            {formData.cgu_acceptees && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            J'accepte les <a href="#" className="underline hover:text-foreground" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>Conditions Générales d'Utilisation</a>
                                        </span>
                                    </label>

                                    <button 
                                        onClick={handleFinalSubmit}
                                        disabled={isSubmitting || !formData.cgu_acceptees}
                                        className="px-8 py-3 bg-foreground text-background text-sm font-semibold rounded-md hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 w-full md:w-auto"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Déployer Profil"}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// ─────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────
function InputRenderer({ q, val, setVal, onEnter, taxonomy, domaine, metier, formData, setFormData }: any) {
    const defaultClasses = "w-full bg-background border border-border rounded-md px-4 py-3 text-sm text-foreground focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-muted-foreground";
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => { setTimeout(() => ref.current?.focus(), 100); }, [q.key]);

    if (q.type === "location") {
        return (
            <div className="p-1 min-w-[300px]">
                <CountryCitySelector
                    countryLabel="Pays"
                    cityLabel="Ville"
                    countryName="pays_residence"
                    cityName="ville"
                    selectedCountry={formData.pays_residence}
                    selectedCity={formData.ville}
                    onCountryChange={(v) => setFormData((prev: any) => ({ ...prev, pays_residence: v }))}
                    onCityChange={(v) => setFormData((prev: any) => ({ ...prev, ville: v }))}
                    grid={false}
                />
            </div>
        );
    }
    
    if (q.type === "skills") {
        const suggestions = q.key === "outils" 
            ? (taxonomy[domaine]?.jobs?.[metier]?.tools || [])
            : (taxonomy[domaine]?.jobs?.[metier]?.skills || []);
            
        return (
            <div className="min-w-[300px]">
                <SkillSelector
                    label=""
                    selectedSkills={(val as string[]) || []}
                    onSkillsChange={(newVals) => setVal(newVals)}
                    suggestions={suggestions}
                    placeholder={`Ajouter ${q.title.toLowerCase()}...`}
                />
            </div>
        );
    }

    if (q.type === "select") {
        let opts = q.options || [];
        if (q.dynamic && q.key === "domaine") opts = [...Object.keys(taxonomy), "Autre"].map(o => ({ value: o, label: o }));
        if (q.dynamic && q.key === "metier" && domaine && domaine !== "Autre") opts = [...Object.keys(taxonomy[domaine]?.jobs || {}), "Autre"].map(o => ({ value: o, label: o }));

        return (
            <select className={defaultClasses + " appearance-none cursor-pointer"} value={val || ""} onChange={e => setVal(e.target.value)}>
                <option value="" disabled>{q.placeholder || "Sélectionnez..."}</option>
                {opts.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        );
    }
    if (q.type === "boolean") {
        return (
            <div className="flex gap-4">
                {[true, false].map(b => (
                    <button key={String(b)} onClick={() => setVal(b)} className={`flex-1 py-3 rounded-md border text-sm font-medium transition-all ${val === b ? 'bg-foreground text-background border-transparent' : 'border-border text-muted-foreground hover:border-foreground/40'}`}>
                        {b ? 'Oui' : 'Non'}
                    </button>
                ))}
            </div>
        );
    }
    if (q.type === "file") {
        return (
            <label className="flex items-center justify-center w-full min-h-[100px] border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all text-sm text-muted-foreground relative overflow-hidden">
                <input type="file" className="hidden" accept={q.key === "cv" ? ".pdf" : "image/*"} onChange={e => setVal(e.target.files?.[0] || null)} />
                {val instanceof File ? <div className="text-foreground bg-muted px-4 py-2 rounded-md">{val.name}</div> : <div className="flex gap-2 items-center"><Upload className="w-4 h-4"/> Cliquez pour envoyer</div>}
            </label>
        );
    }
    return (
        <input 
            ref={ref} type={q.type} className={defaultClasses} value={val || ""} 
            placeholder={q.placeholder || "Réponse..."} 
            onChange={e => setVal(e.target.value)} 
            onKeyDown={e => { if(e.key === "Enter") onEnter() }} 
        />
    );
}
