
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Briefcase, Eye, Star, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardOverview() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const firstName = user.name ? user.name.split(' ')[0] : 'Consultant';

    const stats = [
        {
            title: "Vues du profil",
            value: "1,234",
            change: "+12%",
            icon: Eye,
            color: "text-blue-500",
        },
        {
            title: "Propositions",
            value: "5",
            change: "+2 cette semaine",
            icon: Briefcase,
            color: "text-purple-500",
        },
        {
            title: "Note moyenne",
            value: "4.9/5",
            change: "Basé sur 12 avis",
            icon: Star,
            color: "text-yellow-500",
        },
        {
            title: "Taux de réponse",
            value: "95%",
            change: "Excellent",
            icon: Activity,
            color: "text-green-500",
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Bienvenue, {firstName}!
                </h1>
                <p className="text-muted-foreground">
                    Voici ce qui se passe sur votre espace consultant aujourd'hui.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Recommended Missions */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Missions recommandées par l'IA</CardTitle>
                        <CardDescription>
                            Basé sur vos compétences et votre disponibilité.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold transition-colors group-hover:text-primary">Développeur Senior React / Node.js</h3>
                                            <Badge variant="secondary" className="text-xs">Remote</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">TechCorp Solutions • Paris</p>
                                        <div className="flex gap-2 text-xs text-muted-foreground mt-2">
                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">React</span>
                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">Node.js</span>
                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">TypeScript</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="font-bold text-lg">650€ / jour</span>
                                        <Button size="sm" variant="outline">Voir détails</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Completion / Recent Activity */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>État du profil</CardTitle>
                        <CardDescription>
                            Complétez votre profil pour augmenter votre visibilité.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">Progression</span>
                                <span className="text-muted-foreground">85%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[85%] rounded-full" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">À faire</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="h-5 w-5 rounded-full border border-primary/30 flex items-center justify-center">
                                        <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
                                    </div>
                                    <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Ajouter une certification vidéo</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="h-5 w-5 rounded-full border border-primary/30 flex items-center justify-center">
                                        <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
                                    </div>
                                    <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Connecter votre GitHub</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="line-through text-muted-foreground/50">Valider l'identité</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Booster mon profil
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
