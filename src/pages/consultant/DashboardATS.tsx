import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
    Upload,
    FileText,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Sparkles,
    Lightbulb,
    Search,
    Loader2,
    Zap,
    Linkedin,
    Phone,
    Mail,
    Award,
    Dna,
    Target,
    ZapOff,
    BrainCircuit,
    Star,
    AlertTriangle,
    ShieldCheck,
    Quote,
    Download,
    Eye,
    X,
    FileDown,
    Wand2
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function DashboardATS() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [isGeneratingCV, setIsGeneratingCV] = useState(false);
    const [generatedLatex, setGeneratedLatex] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== "application/pdf") {
                toast({
                    title: "Format non supporté",
                    description: "Veuillez sélectionner un fichier PDF.",
                    variant: "destructive",
                });
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setResult(null);
        setGeneratedLatex(null);

        const formData = new FormData();
        formData.append("cv", file);
        if (jobDescription) {
            formData.append("jobDescription", jobDescription);
        }

        try {
            const response = await api.checkATS(formData);
            if (response.success) {
                setResult(response.data);
                toast({
                    title: "Analyse terminée",
                    description: "Votre CV a été analysé avec succès par l'IA.",
                });
            } else {
                toast({
                    title: "Erreur",
                    description: response.message || "L'analyse a échoué.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Une erreur réseau est survenue.",
                variant: "destructive",
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGenerateCV = async () => {
        if (!result || !result.resumeText) {
            toast({
                title: "Oups!",
                description: "Nous avons besoin de l'analyse préalable pour générer un CV.",
                variant: "destructive"
            });
            return;
        }

        setIsGeneratingCV(true);
        try {
            const response = await api.generateCV({
                resumeText: result.resumeText,
                analysis: result.ai_insights,
                jobDescription: jobDescription
            });

            if (response.success) {
                setGeneratedLatex(response.data.latex);
                setIsPreviewOpen(true);
                toast({
                    title: "LaTeX Généré avec succès ✨",
                    description: "Votre nouveau CV optimisé est prêt en format LaTeX.",
                });
            } else {
                throw new Error(response.message);
            }
        } catch (error: any) {
            toast({
                title: "Erreur de génération",
                description: error.message || "L'IA n'a pas pu générer le CV.",
                variant: "destructive",
            });
        } finally {
            setIsGeneratingCV(false);
        }
    };

    const handleCopyLatex = () => {
        if (generatedLatex) {
            navigator.clipboard.writeText(generatedLatex);
            toast({
                title: "Copié !",
                description: "Le code LaTeX a été copié dans votre presse-papiers.",
            });
        }
    };

    const handleDownloadCV = async () => {
        if (!generatedLatex) return;

        setIsDownloading(true);
        try {
            // Using latex.ytotech.com free public API
            const response = await fetch("https://latex.ytotech.com/builds/sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    compiler: "pdflatex",
                    resources: [
                        {
                            main: true,
                            content: generatedLatex
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error('La compilation a échoué. Veuillez réessayer.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'CV_Optimise_ATS.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "Succès",
                description: "Le PDF a été généré et le téléchargement a commencé.",
            });
        } catch (error: any) {
            console.error("Download error:", error);
            toast({
                title: "Erreur de téléchargement",
                description: error.message || "Impossible de générer le PDF.",
                variant: "destructive",
            });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="relative space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl text-white shadow-xl shadow-indigo-500/20">
                            <BrainCircuit className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                            Talent Intelligence Engine
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl font-medium">
                        Auditez votre profil avec <span className="text-indigo-600 font-bold">Gemini 1.5 Pro</span>. Notre moteur analyse la profondeur de vos expériences,
                        votre impact et la conformité ATS par rapport aux offres.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {result && (
                        <Button
                            variant="secondary"
                            onClick={handleGenerateCV}
                            disabled={isGeneratingCV}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-indigo-200"
                        >
                            {isGeneratingCV ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> IA en action...</>
                            ) : (
                                <><Wand2 className="mr-2 h-4 w-4" /> Générer CV Optimisé</>
                            )}
                        </Button>
                    )}
                    {result && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setResult(null);
                                setFile(null);
                                setJobDescription("");
                                setGeneratedLatex(null);
                            }}
                            className="border-slate-200 hover:bg-slate-50 text-slate-600 font-bold h-12 px-6 rounded-xl"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Configuration & Global Score */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden ring-1 ring-black/5">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-500">
                                <Search className="w-4 h-4 text-indigo-500" />
                                Paramètres de l'Audit
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description du Poste (Optionnel)</label>
                                <Textarea
                                    placeholder="Collez ici l'offre d'emploi pour un match précis..."
                                    className="min-h-[120px] rounded-2xl border-slate-200 focus:ring-indigo-500 text-sm font-medium"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    disabled={isAnalyzing || !!result}
                                />
                            </div>

                            <div
                                className={cn(
                                    "relative group border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300",
                                    file
                                        ? "border-emerald-400 bg-emerald-50/20"
                                        : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30",
                                    (isAnalyzing || !!result) && "pointer-events-none opacity-80"
                                )}
                                onClick={() => !isAnalyzing && !result && document.getElementById('cv-upload')?.click()}
                            >
                                <input type="file" id="cv-upload" className="hidden" accept=".pdf" onChange={handleFileChange} />

                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 shadow-lg",
                                    file
                                        ? "bg-emerald-500 text-white scale-110 shadow-emerald-500/20"
                                        : "bg-white text-indigo-500 group-hover:scale-110 shadow-indigo-500/10"
                                )}>
                                    {isAnalyzing ? (
                                        <Loader2 className="w-7 h-7 animate-spin" />
                                    ) : file ? (
                                        <ShieldCheck className="w-7 h-7" />
                                    ) : (
                                        <FileText className="w-7 h-7" />
                                    )}
                                </div>

                                {file ? (
                                    <div className="space-y-1">
                                        <p className="font-bold text-slate-900 truncate max-w-[180px] text-xs">{file.name}</p>
                                        <p className="text-[9px] uppercase tracking-widest text-emerald-600 font-black">Document chargé</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-700">Déposez votre CV (PDF)</p>
                                        <p className="text-[9px] text-slate-400 uppercase tracking-tighter">Confidentialité Totale</p>
                                    </div>
                                )}

                                {isAnalyzing && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-[2rem]">
                                        <div className="flex flex-col items-center gap-3 px-6 w-full">
                                            <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">
                                                Intelligence en Action...
                                            </div>
                                            <Progress value={85} className="h-1 w-full bg-indigo-100" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {!result && (
                                <Button
                                    className="w-full h-14 text-xs font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl shadow-indigo-500/30 rounded-2xl group transition-all"
                                    disabled={!file || isAnalyzing}
                                    onClick={handleAnalyze}
                                >
                                    {isAnalyzing ? (
                                        <><Loader2 className="mr-3 h-4 w-4 animate-spin" /> Audit en cours...</>
                                    ) : (
                                        <><Zap className="mr-3 h-4 w-4 text-indigo-300 group-hover:scale-125 transition-transform" /> Lancer l'Audit</>
                                    )}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {result && (
                        <Card className="border-none shadow-2xl bg-slate-900 text-white overflow-hidden rounded-[2rem] ring-1 ring-white/10">
                            <CardContent className="p-8 space-y-8 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full -mr-10 -mt-10" />

                                <div className="space-y-2 relative z-10 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <div className="p-1 bg-amber-400/20 rounded text-amber-400">
                                            <Star className="w-3 h-3 fill-current" />
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Score Global de Match</span>
                                    </div>
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className="text-7xl font-black tabular-nums tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
                                            {result.score}
                                        </span>
                                        <span className="text-xl font-bold text-slate-500">%</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-2">Séniorité</p>
                                        <div className="text-xs font-bold text-white px-3 py-1 bg-indigo-500/20 rounded-lg">{result.experience.level}</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-2">Alignement Exp.</p>
                                        <div className={cn(
                                            "text-xs font-bold px-3 py-1 rounded-lg uppercase",
                                            result.ai_insights.experience_alignment === "high" ? "bg-emerald-500/20 text-emerald-400" :
                                                result.ai_insights.experience_alignment === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-rose-500/20 text-rose-400"
                                        )}>
                                            {result.ai_insights.experience_alignment || "Medium"}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10 pb-4">
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest text-center">Performance Algorithmatique</p>
                                    <div className="space-y-4">
                                        {Object.entries(result.ai_insights.score_details || {}).map(([key, val]: [string, any]) => (
                                            <div key={key} className="space-y-1.5">
                                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                                    <span className="opacity-60">{key}</span>
                                                    <span>{val}%</span>
                                                </div>
                                                <Progress value={val} className="h-1 bg-white/5" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column: AI Insights & Details */}
                {result ? (
                    <div className="lg:col-span-8 space-y-6 animate-in slide-in-from-right-10 duration-700">
                        {/* Executive AI Summary */}
                        <Card className="border-none shadow-2xl bg-gradient-to-br from-white to-indigo-50/30 ring-1 ring-indigo-100 overflow-hidden relative">
                            <div className="absolute top-4 left-4 text-indigo-200/50">
                                <Quote className="w-12 h-12 rotate-180" />
                            </div>
                            <CardHeader className="pb-2 pt-8 relative z-10">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5" /> Intelligence Synthétique
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-8 relative z-10">
                                <p className="text-lg font-semibold text-slate-800 leading-relaxed italic pr-8">
                                    "{result.ai_insights.executive_summary}"
                                </p>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Skills Matching */}
                            <Card className="border-none shadow-xl bg-white overflow-hidden">
                                <CardHeader className="bg-emerald-500/5 p-6 border-b border-emerald-500/10">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> Compétences Matchées
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 flex flex-wrap gap-2">
                                    {result.ai_insights.matched_skills?.length > 0 ? (
                                        result.ai_insights.matched_skills.map((s: string) => (
                                            <Badge key={s} className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-bold uppercase text-[9px]">
                                                {s}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 font-medium">Aucun match direct identifié.</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-xl bg-white overflow-hidden">
                                <CardHeader className="bg-rose-500/5 p-6 border-b border-rose-500/10">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-rose-600 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" /> Skills Manquants (Gaps)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 flex flex-wrap gap-2">
                                    {result.ai_insights.missing_skills?.length > 0 ? (
                                        result.ai_insights.missing_skills.map((s: string) => (
                                            <Badge key={s} className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 font-bold uppercase text-[9px]">
                                                {s}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 font-medium">Parfait ! Pas de lacunes majeures.</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Pros & Cons */}
                            <Card className="border-none shadow-xl overflow-hidden group hover:shadow-emerald-500/5 transition-all">
                                <CardHeader className="bg-indigo-500/5 p-6 border-b border-indigo-500/10">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" /> Atouts Différenciants
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-5 space-y-4">
                                    {result.ai_insights.strengths.map((s: string, i: number) => (
                                        <div key={i} className="flex gap-3 text-[13px] font-bold text-slate-700 leading-snug">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                            {s}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-xl overflow-hidden bg-white">
                                <CardHeader className="bg-amber-500/5 p-6 border-b border-amber-500/10">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">
                                        <Dna className="w-4 h-4" /> Keyword Gaps (SEO)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-5 space-y-3">
                                    {result.ai_insights.keyword_gaps?.length > 0 ? (
                                        result.ai_insights.keyword_gaps.map((gap: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-50/50 text-xs font-bold text-amber-800 border border-amber-100">
                                                <XCircle className="w-3.5 h-3.5 text-amber-500" />
                                                {gap}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 font-medium italic">Keywords optimisés pour l'offre.</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recommendations */}
                            <Card className="border-none shadow-2xl bg-indigo-900 text-white md:col-span-2 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-indigo-950" />
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -mb-32 -mr-32" />
                                <CardHeader className="p-8 pb-4 relative z-10">
                                    <CardTitle className="text-sm font-black uppercase tracking-widest text-indigo-300 flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded-xl">
                                            <Lightbulb className="w-5 h-5 text-amber-400" />
                                        </div>
                                        Plan d'Action Stratégique
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Recommandations</p>
                                        {result.ai_insights.tailored_suggestions.map((s: string, i: number) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold leading-relaxed group hover:bg-white/10 transition-colors">
                                                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Checklist de Conformité</p>
                                        {result.ai_insights.ats_tips?.map((tip: string, i: number) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 text-xs font-bold">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                {tip}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    /* Initial Welcome/Marketing Section */
                    <div className="lg:col-span-8 space-y-8 h-fit">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Card className="group h-full border-none shadow-xl bg-white p-8 space-y-5 hover:translate-y-[-8px] transition-all duration-500 ring-1 ring-slate-100">
                                    <div className="w-14 h-14 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-lg shadow-indigo-500/10">
                                        <BrainCircuit className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-slate-900 mb-2">Analyse Sémantique</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                            Gemini 1.5 Pro ne se contente pas de chercher des mots-clés. Il comprend la structure narrative de vos expériences et en extrait la valeur ajoutée réelle par rapport à l'offre.
                                        </p>
                                    </div>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card className="group h-full border-none shadow-xl bg-white p-8 space-y-5 hover:translate-y-[-8px] transition-all duration-500 ring-1 ring-slate-100">
                                    <div className="w-14 h-14 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-lg shadow-emerald-500/10">
                                        <Target className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-slate-900 mb-2">Audit de Conformité</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                            Votre CV est-il lisible par les robots ? Nous testons la structure de votre PDF et vous indiquons les points de blocage pour les grands ATS du marché.
                                        </p>
                                    </div>
                                </Card>
                            </motion.div>
                        </div>

                        <Card className="border-none shadow-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 blur-[120px] rounded-full -mr-32 -mt-32" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="space-y-4 flex-1">
                                    <Badge className="bg-indigo-500 text-white border-none font-black px-3 py-1">NOUVEAU</Badge>
                                    <h2 className="text-3xl font-black tracking-tight leading-tight">Match intelligently with Job Descriptions.</h2>
                                    <p className="text-indigo-200 font-medium">
                                        Collez une offre d'emploi et laissez l'IA analyser l'alignement de votre profil en temps réel. Augmentez vos chances de sélection.
                                    </p>
                                </div>
                                <div className="w-full md:w-auto">
                                    <Button
                                        size="lg"
                                        onClick={() => document.getElementById('cv-upload')?.click()}
                                        className="w-full md:w-auto h-16 px-10 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-black uppercase tracking-widest shadow-2xl shadow-white/10"
                                    >
                                        Commencer l'Audit
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* CV LaTeX Code Modal */}
            <AnimatePresence>
                {isPreviewOpen && generatedLatex && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 md:p-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-5xl h-[85vh] flex flex-col rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50"
                        >
                            {/* Modal Header */}
                            <div className="p-6 md:px-10 flex items-center justify-between border-b bg-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-indigo-600 rounded-xl text-white">
                                        <Wand2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Code LaTeX du CV Optimisé</h2>
                                        <p className="text-xs text-slate-500 font-medium tracking-tight">Prêt pour Overleaf ou votre compilateur local</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={handleCopyLatex}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 rounded-xl gap-2"
                                    >
                                        <Award className="w-4 h-4" />
                                        Copier le Code
                                    </Button>
                                    <Button
                                        onClick={handleDownloadCV}
                                        disabled={isDownloading}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 rounded-xl gap-2 min-w-[160px]"
                                    >
                                        {isDownloading ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Génération...</>
                                        ) : (
                                            <><FileDown className="w-4 h-4" /> Download CV</>
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsPreviewOpen(false)}
                                        className="rounded-full hover:bg-slate-200"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Modal Content - Code Block */}
                            <div className="flex-1 bg-[#0f172a] p-6 md:p-10 overflow-hidden flex flex-col relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                                <div className="flex-1 rounded-2xl border border-white/5 bg-[#020617] overflow-auto custom-scrollbar shadow-inner">
                                    <pre className="p-8 text-indigo-100/90 font-mono text-[13px] leading-relaxed whitespace-pre selection:bg-indigo-500/30">
                                        {generatedLatex}
                                    </pre>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <p className="text-[11px] text-slate-400 font-medium">
                                            Astuce : Utilisez <a href="https://www.overleaf.com" target="_blank" rel="noreferrer" className="text-indigo-400 border-b border-indigo-400/30 hover:border-indigo-400 transition-colors">Overleaf</a> pour compiler ce code.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500">
                                            ATS Optimized Format
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
