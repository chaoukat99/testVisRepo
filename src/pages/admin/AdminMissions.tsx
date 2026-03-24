
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Eye, AlertCircle, Loader2, Calendar, MapPin, Briefcase, Euro, User, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MissionDetails } from "@/components/missions/MissionDetails";
import { ConsultantProfileDialog } from "@/components/admin/ConsultantProfileDialog";

export default function AdminMissions() {
    const [missions, setMissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMission, setSelectedMission] = useState<any>(null);
    const [missionApplications, setMissionApplications] = useState<any[]>([]);
    const [isAppsLoading, setIsAppsLoading] = useState(false);
    const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
    const { toast } = useToast();

    const fetchMissions = async () => {
        setIsLoading(true);
        try {
            const response = await api.getAdminMissions();
            if (response.success) {
                setMissions(response.missions || []);
            }
        } catch (error) {
            console.error("Error fetching missions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMissions();
    }, []);

    useEffect(() => {
        if (selectedMission) {
            fetchApplications(selectedMission.id);
        } else {
            setMissionApplications([]);
        }
    }, [selectedMission]);

    const fetchApplications = async (missionId: string) => {
        setIsAppsLoading(true);
        try {
            const response = await api.getApplicationsByMission(missionId);
            if (response.success) {
                setMissionApplications(response.applications || []);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setIsAppsLoading(false);
        }
    };

    const handleApprove = async (missionId: string) => {
        try {
            const response = await api.approveMission(missionId);
            if (response.success) {
                toast({
                    title: "Mission approuvée",
                    description: "La mission est maintenant visible par les consultants.",
                });
                fetchMissions();
                setSelectedMission(null);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible d'approuver la mission.",
            });
        }
    };

    const handleReject = async (missionId: string) => {
        try {
            const response = await api.rejectMission(missionId);
            if (response.success) {
                toast({
                    title: "Mission rejetée",
                    description: "La mission a été marquée comme rejetée.",
                });
                fetchMissions();
                setSelectedMission(null);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de rejeter la mission.",
            });
        }
    };

    const handleApplicationAction = async (appId: string, action: 'approve' | 'reject') => {
        try {
            const response = await api.validateApplication(appId, action);
            if (response.success) {
                toast({
                    title: action === 'approve' ? "Candidature validée" : "Candidature refusée",
                    description: action === 'approve' ? "Le consultant a été transmis à l'entreprise." : "La candidature a été rejetée.",
                });
                if (selectedMission) {
                    fetchApplications(selectedMission.id);
                }
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de traiter la candidature.",
            });
        }
    };

    const handleViewConsultant = async (consultantId: string) => {
        try {
            const response = await api.getConsultantById(consultantId);
            if (response.success) {
                setSelectedConsultant(response.consultant);
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de charger les détails du consultant."
                });
            }
        } catch (error) {
            console.error("Error fetching consultant details:", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors du chargement."
            });
        }
    };

    const pendingMissions = missions.filter(m => m.status === 'Draft' || !m.status || m.status === 'Pending');
    const activeMissions = missions.filter(m => m.status === 'Published');
    const rejectedMissions = missions.filter(m => m.status === 'Rejected');

    const MissionCard = ({ mission }: { mission: any }) => (
        <Card key={mission.id} className="flex flex-col md:flex-row items-center justify-between p-6 gap-4 hover:shadow-md transition-shadow group">
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{mission.title}</h3>
                    <Badge variant="secondary" className="bg-muted/50">{mission.company_name}</Badge>
                    <Badge variant={mission.status === 'Published' ? 'default' : (mission.status === 'Rejected' ? 'destructive' : 'secondary')} className="text-[10px] h-5 uppercase">
                        {mission.status === 'Published' ? 'Active' : (mission.status === 'Rejected' ? 'Rejetée' : 'À valider')}
                    </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5"><Euro className="w-4 h-4 text-primary" /> {mission.budget_min}-{mission.budget_max}€/j</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> {new Date(mission.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {mission.location || mission.city}</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9" onClick={() => setSelectedMission(mission)}>
                    <Eye className="w-4 h-4 mr-2" /> Examiner
                </Button>
                {mission.status !== 'Published' && (
                    <Button size="sm" className="h-9 bg-green-600 hover:bg-green-700" onClick={() => handleApprove(mission.id)}>
                        <Check className="w-4 h-4 mr-2" /> Valider
                    </Button>
                )}
                {mission.status !== 'Rejected' && (
                    <Button variant="destructive" size="sm" className="h-9" onClick={() => handleReject(mission.id)}>
                        <X className="w-4 h-4 mr-2" /> Rejeter
                    </Button>
                )}
            </div>
        </Card>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Modération des Missions</h1>
                    <p className="text-muted-foreground">
                        Examen et validation des nouvelles propositions de missions.
                    </p>
                </div>
                {isLoading && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="bg-muted/50 p-1 mb-2">
                    <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        En attente ({pendingMissions.length})
                    </TabsTrigger>
                    <TabsTrigger value="active" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Actives ({activeMissions.length})
                    </TabsTrigger>
                    <TabsTrigger value="rejected" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Rejetées ({rejectedMissions.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    {pendingMissions.length > 0 ? (
                        pendingMissions.map(mission => <MissionCard key={mission.id} mission={mission} />)
                    ) : (
                        <div className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed">
                            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground">Aucune mission en attente de validation.</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="active" className="space-y-4">
                    {activeMissions.length > 0 ? (
                        activeMissions.map(mission => <MissionCard key={mission.id} mission={mission} />)
                    ) : (
                        <div className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed">
                            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground">Aucune mission active pour le moment.</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="rejected" className="space-y-4">
                    {rejectedMissions.length > 0 ? (
                        rejectedMissions.map(mission => <MissionCard key={mission.id} mission={mission} />)
                    ) : (
                        <div className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed">
                            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground">Aucune mission rejetée.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <Dialog open={!!selectedMission} onOpenChange={() => setSelectedMission(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    {selectedMission && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-xl">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                    Examen de la mission
                                </DialogTitle>
                                <DialogDescription>
                                    Vérifiez la conformité de la proposition avant validation.
                                </DialogDescription>
                            </DialogHeader>
                            <MissionDetails
                                mission={selectedMission}
                                onClose={() => setSelectedMission(null)}
                                footerActions={
                                    <div className="flex justify-end gap-3 w-full">
                                        <Button variant="outline" onClick={() => setSelectedMission(null)}>Fermer</Button>
                                        {selectedMission.status !== 'Rejected' && (
                                            <Button variant="destructive" onClick={() => handleReject(selectedMission.id)}>
                                                <X className="w-4 h-4 mr-2" /> Rejeter Mission
                                            </Button>
                                        )}
                                        {selectedMission.status !== 'Published' && (
                                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(selectedMission.id)}>
                                                <Check className="w-4 h-4 mr-2" /> Approuver & Publier
                                            </Button>
                                        )}
                                    </div>
                                }
                            />

                            {/* Section Participations Consultants */}
                            <div className="mt-8 border-t pt-6">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    Candidatures reçues ({missionApplications.length})
                                </h3>

                                {isAppsLoading ? (
                                    <div className="flex justify-center p-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    </div>
                                ) : missionApplications.length > 0 ? (
                                    <div className="grid gap-4">
                                        {missionApplications.map((app) => (
                                            <Card key={app.id} className="p-4 bg-muted/30 border-none shadow-none">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                                            {app.photo_profil_url ? (
                                                                <img src={app.photo_profil_url} alt="" className="h-full w-full object-cover" />
                                                            ) : (
                                                                <User className="w-6 h-6 text-primary" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm">{app.prenom} {app.nom}</p>
                                                            <p className="text-xs text-muted-foreground">{app.metier || 'Consultant'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-4">
                                                        <Badge variant="outline" className={`text-[10px] uppercase ${app.status === 'En attente d\'approbation Admin' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                                            app.status === 'Transmis à l\'entreprise' ? 'bg-green-50 text-green-600 border-green-200' :
                                                                'bg-red-50 text-red-600 border-red-200'
                                                            }`}>
                                                            {app.status === 'En attente d\'approbation Admin' ? 'À modérer' : app.status}
                                                        </Badge>

                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => handleViewConsultant(app.consultant_id)}
                                                                title="Voir le profil"
                                                            >
                                                                <Eye className="w-4 h-4 text-primary" />
                                                            </Button>

                                                            {app.status === 'En attente d\'approbation Admin' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-50"
                                                                        onClick={() => handleApplicationAction(app.id, 'approve')}
                                                                    >
                                                                        <Send className="w-3 h-3 mr-1" /> Transmettre
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50"
                                                                        onClick={() => handleApplicationAction(app.id, 'reject')}
                                                                    >
                                                                        <X className="w-3 h-3 mr-1" /> Refuser
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 bg-muted/20 rounded-xl text-center border border-dashed">
                                        <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                                        <p className="text-sm text-muted-foreground">Aucune candidature pour cette mission pour le moment.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            <ConsultantProfileDialog
                isOpen={!!selectedConsultant}
                onClose={() => setSelectedConsultant(null)}
                user={selectedConsultant}
            />
        </div>
    );
}
