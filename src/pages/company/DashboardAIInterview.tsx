
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, Bot, Timer, ShieldCheck } from "lucide-react";

export default function DashboardAIInterview() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20">
                    <div className="size-64 rounded-full bg-white" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
                    <Badge variant="secondary" className="bg-white/20 text-white border-none backdrop-blur-md px-4 py-1 animate-pulse">
                        <Sparkles className="w-3 h-3 mr-2" /> Fonctionnalité en développement
                    </Badge>

                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Planifiez vos entretiens avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-white">l'Intelligence Artificielle</span>
                    </h1>

                    <p className="text-indigo-100 text-lg md:text-xl font-medium leading-relaxed">
                        Évaluez vos candidats plus rapidement et sans biais grâce à notre agent conversationnel intelligent spécialisé dans le recrutement technique et métier.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-bold border border-white/10">
                            <Bot className="w-4 h-4 text-yellow-300" /> Agent IA 24/7
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-bold border border-white/10">
                            <Timer className="w-4 h-4 text-emerald-300" /> Analyse en temps réel
                        </div>
                    </div>
                </div>
            </div>

            {/* Coming Soon Card */}
            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-12 flex flex-col items-center text-center space-y-8">
                    <div className="size-24 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner group">
                        <Calendar className="size-12 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent">
                            Planification d'Entretien AI
                        </h2>
                        <div className="flex flex-col items-center gap-4">
                            <span className="px-6 py-2 bg-indigo-600 text-white rounded-full font-black text-sm tracking-widest uppercase shadow-lg shadow-indigo-200">
                                Coming Soon
                            </span>
                            <p className="text-muted-foreground text-lg max-w-md">
                                Nous finalisons les derniers réglages de notre moteur de matching vocal et textuel pour vous offrir une expérience de recrutement révolutionnaire.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8">
                        {[
                            { icon: ShieldCheck, title: "Zéro Biais", desc: "Évaluation purement basée sur les compétences" },
                            { icon: Bot, title: "Questions Dynamiques", desc: "L'IA s'adapte aux réponses du candidat" },
                            { icon: Calendar, title: "Disponibilité Totale", desc: "Entretiens automatiques même le week-end" }
                        ].map((feature, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                                <feature.icon className="size-8 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold text-slate-900 text-lg mb-2">{feature.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Newsletter/Waitlist CTA */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 size-64 bg-indigo-500/20 blur-[100px]" />
                <div className="space-y-2 relative z-10">
                    <h3 className="text-xl font-bold">Soyez informé du lancement officiel</h3>
                    <p className="text-slate-400 text-sm">Recevez une notification dès que l'agent IA sera prêt à interviewer vos premiers talents.</p>
                </div>
                <div className="flex w-full md:w-auto gap-2 relative z-10">
                    <input
                        type="email"
                        placeholder="votre@email.com"
                        className="bg-white/10 border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                    />
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold whitespace-nowrap transition-colors">
                        M'inscrire
                    </button>
                </div>
            </div>
        </div>
    );
}
