
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, DollarSign, Activity, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    AreaChart,
    Area
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const userData = [
    { month: "Jan", consultants: 400, companies: 240 },
    { month: "Feb", consultants: 300, companies: 139 },
    { month: "Mar", consultants: 200, companies: 980 },
    { month: "Apr", consultants: 278, companies: 390 },
    { month: "May", consultants: 189, companies: 480 },
    { month: "Jun", consultants: 239, companies: 380 },
    { month: "Jul", consultants: 349, companies: 430 },
];

const revenueData = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 61000 },
    { month: "May", revenue: 55000 },
    { month: "Jun", revenue: 67000 },
    { month: "Jul", revenue: 75000 },
];

const userChartConfig = {
    consultants: {
        label: "Consultants",
        color: "hsl(var(--primary))",
    },
    companies: {
        label: "Entreprises",
        color: "hsl(var(--secondary))",
    },
};

const revenueChartConfig = {
    revenue: {
        label: "Revenu",
        color: "hsl(var(--primary))",
    },
};

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminOverview() {
    const [statsData, setStatsData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.getStats();
                if (response.success) {
                    setStatsData(response.stats);
                }
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        {
            title: "Utilisateurs Totaux",
            value: isLoading ? "..." : (statsData?.totalUsers || 0).toLocaleString(),
            change: statsData ? `${statsData.companies} entr. / ${statsData.consultants} cons.` : "Chargement...",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Missions Publiées",
            value: isLoading ? "..." : (statsData?.activeMissions || 0).toLocaleString(),
            change: "Visibles sur le job board",
            icon: Briefcase,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            title: "Inscriptions à valider",
            value: isLoading ? "..." : (statsData?.pendingRequests || 0).toLocaleString(),
            change: "Entreprises & Consultants",
            icon: Activity,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
        },
        {
            title: "Participations Missions",
            value: isLoading ? "..." : (statsData?.pendingApplications || 0).toLocaleString(),
            change: "Demandes à modérer",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Flux financier",
            value: "1.2M€",
            change: "+8.5% ce mois",
            icon: DollarSign,
            color: "text-blue-600",
            bg: "bg-blue-600/10",
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Vue d'ensemble Système</h1>
                <p className="text-muted-foreground">
                    Monitoring en temps réel de la plateforme Synergy Hub.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
                                <div className={`p-2 rounded-full ${stat.bg}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Croissance des Utilisateurs</CardTitle>
                        <CardDescription>Évolution des inscriptions mensuelles</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ChartContainer config={userChartConfig}>
                                <AreaChart data={userData} margin={{ left: -20, right: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area
                                        type="monotone"
                                        dataKey="consultants"
                                        stroke="hsl(var(--primary))"
                                        fill="hsl(var(--primary))"
                                        fillOpacity={0.2}
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="companies"
                                        stroke="hsl(var(--secondary))"
                                        fill="hsl(var(--secondary))"
                                        fillOpacity={0.2}
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Chiffre d'Affaires</CardTitle>
                                <CardDescription>Revenu mensuel généré</CardDescription>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium bg-emerald-500/10 px-2 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3" /> +15%
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ChartContainer config={revenueChartConfig}>
                                <BarChart data={revenueData} margin={{ left: -20, right: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                        tickFormatter={(value) => `${value / 1000}k`}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar
                                        dataKey="revenue"
                                        fill="hsl(var(--primary))"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Activité Récente</CardTitle>
                        <CardDescription>
                            Flux des dernières demandes d'inscription.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoading ? (
                                <p className="text-sm text-muted-foreground">Chargement...</p>
                            ) : statsData?.activities?.length > 0 ? (
                                statsData.activities.map((activity: any, i: number) => (
                                    <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className={`h-2 w-2 mt-2 rounded-full ${activity.type === 'company_reg' ? 'bg-blue-500' :
                                                activity.type === 'consultant_reg' ? 'bg-emerald-500' :
                                                    'bg-purple-500'
                                            }`} />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">
                                                {activity.type === 'company_reg' && `Nouvelle demande entreprise : "${activity.name}"`}
                                                {activity.type === 'consultant_reg' && `Nouveau consultant inscrit : "${activity.name}"`}
                                                {activity.type === 'mission_app' && `${activity.name} souhaite participer à : "${activity.mission_title}"`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(activity.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucune activité récente.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Alertes & Actions requises</CardTitle>
                        <CardDescription>
                            Éléments nécessitant votre attention immédiate.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                <div>
                                    <h4 className="font-semibold text-sm text-destructive">Signalement Utilisateur</h4>
                                    <p className="text-xs text-muted-foreground">3 plaintes concernant le profil #8921</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 border border-orange-500/20 bg-orange-500/5 rounded-lg">
                                <Activity className="h-5 w-5 text-orange-500" />
                                <div>
                                    <h4 className="font-semibold text-sm text-orange-600">Latence Système élevée</h4>
                                    <p className="text-xs text-muted-foreground">API Response time &gt; 200ms</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 border border-green-500/20 bg-green-500/5 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <div>
                                    <h4 className="font-semibold text-sm text-green-600">Backup Quotidien</h4>
                                    <p className="text-xs text-muted-foreground">Effectué avec succès à 03:00</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
