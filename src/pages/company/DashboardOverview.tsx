
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, FileText, TrendingUp, Clock, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CompanyDashboardOverview() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const companyName = user.name || 'Votre Entreprise';

    const stats = [
        {
            title: "Missions Actives",
            value: "3",
            change: "+1 ce mois",
            icon: Briefcase,
            color: "text-blue-500",
        },
        {
            title: "Candidatures reçues",
            value: "28",
            change: "+12 cette semaine",
            icon: FileText,
            color: "text-purple-500",
        },
        {
            title: "Entretiens prévus",
            value: "4",
            change: "Pour demain",
            icon: Users,
            color: "text-green-500",
        },
        {
            title: "Dépenses estimées",
            value: "12k€",
            change: "Mois en cours",
            icon: TrendingUp,
            color: "text-yellow-500",
        },
    ];

    const recentApplications = [
        { id: 1, name: "Lucas Martin", role: "Dev React Senior", match: "98%", status: "Nouveau" },
        { id: 2, name: "Sophie Bernard", role: "UX Designer", match: "92%", status: "En attente" },
        { id: 3, name: "Marc Dubois", role: "Devops Engineer", match: "85%", status: "Rejeté" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        {companyName}
                    </h1>
                    <p className="text-muted-foreground">
                        Vue d'ensemble de vos recrutements et missions.
                    </p>
                </div>
                <Button asChild>
                    <Link to="/company/post-mission">
                        <Plus className="mr-2 h-4 w-4" /> Poster une mission
                    </Link>
                </Button>
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
                {/* Active Missions */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Missions en cours</CardTitle>
                        <CardDescription>
                            État d'avancement de vos missions actives.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">Refonte Application Mobile</div>
                                    <Badge>En cours</Badge>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Consultant: Thomas Dubois</span>
                                    <span>Fin: 30 Juin</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[65%] rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">Migration Cloud AWS</div>
                                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">Démarrage</Badge>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Consultant: En attente</span>
                                    <span>Début: 15 Mars</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[5%] rounded-full" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Applications */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Dernières Candidatures</CardTitle>
                        <CardDescription>
                            Candidats récents pour vos offres.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentApplications.map((app) => (
                                <div key={app.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                            {app.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{app.name}</div>
                                            <div className="text-xs text-muted-foreground">{app.role}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-green-600">{app.match} Match</div>
                                        <div className="text-[10px] text-muted-foreground">{app.status}</div>
                                    </div>
                                </div>
                            ))}
                            <Link to="/company/conversations">
                                <Button variant="ghost" className="w-full text-xs">Voir toutes les conversations</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
