
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Building2, ChevronRight } from "lucide-react";

export default function DashboardMissions() {
    const activeMissions = [
        {
            id: 1,
            title: "Refonte Architecture Frontend",
            company: "InnovateTech",
            location: "Paris (Hybride)",
            startDate: "15 Jan 2024",
            endDate: "30 Juin 2024",
            status: "In Progress",
            progress: 65,
        },
    ];

    const applications = [
        {
            id: 2,
            title: "Lead Developer React",
            company: "Global Finance",
            location: "Remote",
            date: "Il y a 2 jours",
            status: "En attente",
            statusColor: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        },
        {
            id: 3,
            title: "Expert Node.js / Microservices",
            company: "StartUp Nation",
            location: "Lyon",
            date: "Il y a 5 jours",
            status: "Entretiens",
            statusColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mes Missions</h1>
                <p className="text-muted-foreground">
                    Suivez vos missions en cours et vos candidatures.
                </p>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="active">En cours</TabsTrigger>
                    <TabsTrigger value="applications">Apply</TabsTrigger>
                    <TabsTrigger value="past">Historique</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-6">
                    <div className="grid gap-6">
                        {activeMissions.length > 0 ? (
                            activeMissions.map((mission) => (
                                <Card key={mission.id} className="overflow-hidden border-l-4 border-l-primary">
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                        <div>
                                            <CardTitle className="text-xl">{mission.title}</CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-2">
                                                <Building2 className="w-4 h-4" /> {mission.company}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="default">En cours</Badge>
                                    </CardHeader>
                                    <CardContent className="grid gap-4 md:grid-cols-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4" /> {mission.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" /> Début: {mission.startDate}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4" /> Fin: {mission.endDate}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-muted/50 flex flex-col gap-4 items-start">
                                        <div className="w-full space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Avancement estimé</span>
                                                <span className="font-medium">{mission.progress}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-500"
                                                    style={{ width: `${mission.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full justify-end">
                                            <Button variant="outline" size="sm">Voir Contrat</Button>
                                            <Button size="sm">Feuille de temps</Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                                <p className="text-muted-foreground">Aucune mission en cours.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="applications" className="mt-6">
                    <div className="grid gap-4">
                        {applications.map((app) => (
                            <div key={app.id} className="flex items-center justify-between p-6 bg-card border rounded-xl hover:shadow-md transition-shadow group">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{app.title}</h3>
                                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                                        <Building2 className="w-3 h-3" /> {app.company} • {app.location}
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <Badge variant="outline" className={`${app.statusColor} border`}>
                                            {app.status}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">Candidature envoyée {app.date}</p>
                                    </div>
                                    <Button size="icon" variant="ghost">
                                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="past" className="mt-6">
                    <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                        <p className="text-muted-foreground">Aucun historique de mission disponible.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
