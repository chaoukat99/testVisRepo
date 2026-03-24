
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Edit, MoreHorizontal, Eye, Loader2, AlertCircle, X, MapPin, Briefcase, DollarSign, FileText, Clock, CheckCircle, Globe, ShieldCheck, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Mission {
    id: string;
    title: string;
    summary: string;
    description: string;
    selected_domain: string;
    selected_job: string;
    country: string;
    city: string;
    work_mode: string;
    status: string;
    created_at: string;
    deadline: string;
    visibility_mode: string;
    seniority_level?: string;
    min_experience_category?: string;
    start_date?: string;
    estimated_duration?: string;
    workload?: string;
    remuneration_type?: string;
    budget_min?: number;
    budget_max?: number;
    contract_type?: string;
    billing_mode?: string;
    num_consultants_preselect?: string;
    is_company_name_visible?: boolean;
    require_nda?: boolean;
    technicalSkills?: string[];
    businessSkills?: string[];
    consultantTypes?: string[];
}

export default function CompanyDashboardMissions() {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [deletingMission, setDeletingMission] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [applications, setApplications] = useState<any[]>([]);
    const [loadingApplications, setLoadingApplications] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyMissions();
    }, []);

    const fetchMyMissions = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getMyMissions();

            if (response.success) {
                setMissions(response.data || []);
            } else {
                setError(response.message || "Erreur lors du chargement des missions");
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: response.message || "Impossible de charger vos missions",
                });
            }
        } catch (err: any) {
            setError(err.message || "Erreur de connexion");
            toast({
                variant: "destructive",
                title: "Erreur de connexion",
                description: "Impossible de charger vos missions. Vérifiez que le serveur est lancé.",
            });
        } finally {
            setLoading(false);
        }
    };

    const viewMissionDetails = async (missionId: string) => {
        try {
            setLoadingDetails(true);
            setDetailsOpen(true);
            const response = await api.getMissionById(missionId);

            if (response.success) {
                setSelectedMission(response.mission);
                fetchMissionApplications(missionId);
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de charger les détails de la mission",
                });
                setDetailsOpen(false);
            }
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: err.message || "Erreur lors du chargement des détails",
            });
            setDetailsOpen(false);
        } finally {
            setLoadingDetails(false);
        }
    };

    const fetchMissionApplications = async (missionId: string) => {
        try {
            setLoadingApplications(true);
            const response = await api.getCompanyApplications(missionId);
            if (response.success) {
                setApplications(response.applications || []);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoadingApplications(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!selectedMission) return;

        try {
            setUpdatingStatus(true);
            const response = await api.updateMissionStatus(selectedMission.id, newStatus);

            if (response.success) {
                setMissions(missions.map(m =>
                    m.id === selectedMission.id ? { ...m, status: newStatus } : m
                ));
                setSelectedMission({ ...selectedMission, status: newStatus });
                toast({
                    title: "Statut mis à jour",
                    description: `La mission est maintenant ${getStatusLabel(newStatus)}`,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de mettre à jour le statut",
                });
            }
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: err.message || "Erreur lors de la mise à jour",
            });
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleVisibilityChange = async (field: string, value: any) => {
        if (!selectedMission) return;

        try {
            const data: any = {};
            data[field] = value;

            // If visibility is changed to "Restreinte", auto-switch status to "Draft"
            let shouldUpdateStatus = false;
            if (field === 'visibility_mode' && value === 'Restreinte' && selectedMission.status !== 'Draft') {
                shouldUpdateStatus = true;
            }

            const response = await api.updateMissionVisibility(selectedMission.id, data);

            if (response.success) {
                const updateMap: any = { [field]: value };

                // Auto-switch to Draft if Restreinte
                if (shouldUpdateStatus) {
                    const statusResponse = await api.updateMissionStatus(selectedMission.id, 'Draft');
                    if (statusResponse.success) {
                        updateMap.status = 'Draft';
                        toast({
                            title: "Visibilité et statut mis à jour",
                            description: "La mission a été mise en mode Restreint et basculée en Brouillon",
                        });
                    }
                } else {
                    toast({
                        title: "Visibilité mise à jour",
                        description: "Les paramètres de visibilité ont été modifiés",
                    });
                }

                setMissions(missions.map(m =>
                    m.id === selectedMission.id ? { ...m, ...updateMap } : m
                ));
                setSelectedMission({ ...selectedMission, ...updateMap });
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de mettre à jour la visibilité",
                });
            }
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: err.message || "Erreur lors de la mise à jour",
            });
        }
    };

    const handleDeleteMission = async () => {
        if (!selectedMission) return;

        try {
            setDeletingMission(true);
            const response = await api.deleteMission(selectedMission.id);

            if (response.success) {
                // Update local state to mark as deleted
                setMissions(missions.map(m =>
                    m.id === selectedMission.id ? { ...m, status: 'Deleted' } : m
                ));
                setSelectedMission({ ...selectedMission, status: 'Deleted' });

                toast({
                    title: "Mission supprimée",
                    description: "La mission a été déplacée vers les missions supprimées",
                });

                setDeleteConfirmOpen(false);
                setDetailsOpen(false);
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de supprimer la mission",
                });
            }
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: err.message || "Erreur lors de la suppression",
            });
        } finally {
            setDeletingMission(false);
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status.toLowerCase()) {
            case 'published': return 'Publiée';
            case 'draft': return 'Brouillon';
            case 'closed': return 'Fermée';
            case 'deleted': return 'Supprimée';
            default: return status;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'published':
                return { label: 'Publiée', color: 'bg-green-500/10 text-green-600 border-green-500/20' };
            case 'draft':
                return { label: 'Brouillon', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' };
            case 'closed':
                return { label: 'Fermée', color: 'bg-gray-500/10 text-gray-600 border-gray-500/20' };
            case 'deleted':
                return { label: 'Supprimée', color: 'bg-red-500/10 text-red-600 border-red-500/20' };
            default:
                return { label: status, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
        }
    };

    const filterMissions = (status: string) => {
        switch (status) {
            case 'active':
                return missions.filter(m => m.status.toLowerCase() === 'published');
            case 'drafts':
                return missions.filter(m => m.status.toLowerCase() === 'draft');
            case 'archived':
                return missions.filter(m => m.status.toLowerCase() === 'closed');
            case 'deleted':
                return missions.filter(m => m.status.toLowerCase() === 'deleted');
            default:
                return missions;
        }
    };

    const MissionCard = ({ mission }: { mission: Mission }) => {
        const statusBadge = getStatusBadge(mission.status);
        const formattedDate = mission.created_at
            ? format(new Date(mission.created_at), 'dd MMM yyyy', { locale: fr })
            : 'N/A';

        return (
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className={statusBadge.color}>
                            {statusBadge.label}
                        </Badge>
                        <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                        </Button>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{mission.title}</CardTitle>
                    <CardDescription>
                        {mission.selected_domain} • {mission.city}, {mission.country}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {mission.summary}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> {formattedDate}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                            {mission.work_mode}
                        </Badge>
                    </div>
                </CardContent>
                <CardFooter className="gap-2 pt-2">
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMission(mission);
                            setDeleteConfirmOpen(true);
                        }}
                        disabled={mission.status === 'Deleted'}
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                    </Button>
                    <Button className="w-full" onClick={() => viewMissionDetails(mission.id)}>
                        <Eye className="w-4 h-4 mr-2" /> Voir détails
                    </Button>
                </CardFooter>
            </Card>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Chargement de vos missions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center space-y-4 max-w-md">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                    <h3 className="text-lg font-semibold">Erreur de chargement</h3>
                    <p className="text-muted-foreground">{error}</p>
                    <Button onClick={fetchMyMissions}>Réessayer</Button>
                </div>
            </div>
        );
    }

    const activeMissions = filterMissions('active');
    const draftMissions = filterMissions('drafts');
    const archivedMissions = filterMissions('archived');
    const deletedMissions = filterMissions('deleted');

    return (
        <>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Mes Missions</h1>
                        <p className="text-muted-foreground">
                            Gérez vos offres et consultez les candidatures. ({missions.length} missions)
                        </p>
                    </div>
                    <Button asChild>
                        <Link to="/company/post-mission">Nouvelle Mission</Link>
                    </Button>
                </div>

                <Tabs defaultValue="active" className="w-full">
                    <TabsList>
                        <TabsTrigger value="active">
                            Actives ({activeMissions.length})
                        </TabsTrigger>
                        <TabsTrigger value="drafts">
                            Brouillons ({draftMissions.length})
                        </TabsTrigger>
                        <TabsTrigger value="archived">
                            Archivées ({archivedMissions.length})
                        </TabsTrigger>
                        <TabsTrigger value="deleted">
                            Supprimées ({deletedMissions.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="active" className="mt-6">
                        {activeMissions.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {activeMissions.map((mission) => (
                                    <MissionCard key={mission.id} mission={mission} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                <p className="text-muted-foreground mb-4">Aucune mission active pour le moment.</p>
                                <Button asChild variant="outline">
                                    <Link to="/company/post-mission">Publier votre première mission</Link>
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="drafts" className="mt-6">
                        {draftMissions.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {draftMissions.map((mission) => (
                                    <MissionCard key={mission.id} mission={mission} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground">Aucun brouillon pour le moment.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="archived" className="mt-6">
                        {archivedMissions.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {archivedMissions.map((mission) => (
                                    <MissionCard key={mission.id} mission={mission} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground">Aucune mission archivée.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="deleted" className="mt-6">
                        {deletedMissions.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {deletedMissions.map((mission) => (
                                    <MissionCard key={mission.id} mission={mission} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground">Aucune mission supprimée.</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Mission Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={(open) => {
                setDetailsOpen(open);
                if (!open) {
                    setApplications([]);
                    setSelectedMission(null);
                }
            }}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {loadingDetails ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : selectedMission ? (
                        <>
                            <DialogHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <DialogTitle className="text-2xl pr-8">{selectedMission.title}</DialogTitle>
                                        <DialogDescription className="mt-2">
                                            {selectedMission.summary}
                                        </DialogDescription>
                                    </div>
                                    <Badge variant="outline" className={getStatusBadge(selectedMission.status).color}>
                                        {getStatusBadge(selectedMission.status).label}
                                    </Badge>
                                </div>
                            </DialogHeader>

                            <div className="space-y-6 mt-6">
                                {/* Status Management */}
                                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                        <span className="font-medium">Statut de la mission</span>
                                    </div>
                                    <Select
                                        value={selectedMission.status}
                                        onValueChange={handleStatusChange}
                                        disabled={updatingStatus}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Draft">Brouillon</SelectItem>
                                            <SelectItem value="Published">Publier</SelectItem>
                                            <SelectItem value="Closed">Fermer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Separator />

                                {/* General Info */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-primary" />
                                        Informations Générales
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Domaine:</span>
                                            <p className="font-medium">{selectedMission.selected_domain}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Métier:</span>
                                            <p className="font-medium">{selectedMission.selected_job}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Niveau de séniorité:</span>
                                            <p className="font-medium">{selectedMission.seniority_level || 'Non spécifié'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Expérience minimum:</span>
                                            <p className="font-medium">{selectedMission.min_experience_category || 'Non spécifié'}</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Location & Logistics */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        Modalités Pratiques
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Localisation:</span>
                                            <p className="font-medium">{selectedMission.city}, {selectedMission.country}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Mode de travail:</span>
                                            <p className="font-medium">{selectedMission.work_mode}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Date de démarrage:</span>
                                            <p className="font-medium">
                                                {selectedMission.start_date
                                                    ? format(new Date(selectedMission.start_date), 'dd MMMM yyyy', { locale: fr })
                                                    : 'Non spécifiée'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Durée:</span>
                                            <p className="font-medium">{selectedMission.estimated_duration || 'Non spécifiée'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Charge de travail:</span>
                                            <p className="font-medium">{selectedMission.workload || 'Non spécifiée'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Date limite:</span>
                                            <p className="font-medium">
                                                {selectedMission.deadline
                                                    ? format(new Date(selectedMission.deadline), 'dd MMMM yyyy', { locale: fr })
                                                    : 'Non spécifiée'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Candidates / Applications */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-primary" />
                                        Candidatures Validées ({applications.length})
                                    </h3>
                                    {loadingApplications ? (
                                        <div className="flex justify-center py-4">
                                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : applications.length > 0 ? (
                                        <div className="space-y-3">
                                            {applications.map((app) => (
                                                <div key={app.id} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                            {app.prenom?.charAt(0)}{app.nom?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{app.prenom} {app.nom}</p>
                                                            <p className="text-xs text-muted-foreground">{app.email_professionnel}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                                                            Validé par Admin
                                                        </Badge>
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link to={`/company/search-talents?id=${app.consultant_id}`}>
                                                                <Eye className="w-4 h-4 mr-2" /> Profil
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 bg-muted/20 rounded-lg border border-dashed">
                                            <p className="text-sm text-muted-foreground">Aucune candidature validée pour cette mission.</p>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                {/* Budget & Contract */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-primary" />
                                        Budget & Contrat
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Type de rémunération:</span>
                                            <p className="font-medium">{selectedMission.remuneration_type || 'Non spécifié'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Budget:</span>
                                            <p className="font-medium">
                                                {selectedMission.budget_min && selectedMission.budget_max
                                                    ? `${selectedMission.budget_min}€ - ${selectedMission.budget_max}€`
                                                    : 'Non spécifié'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Type de contrat:</span>
                                            <p className="font-medium">{selectedMission.contract_type || 'Non spécifié'}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Mode de facturation:</span>
                                            <p className="font-medium">{selectedMission.billing_mode || 'Non spécifié'}</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Description */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-primary" />
                                        Description Détaillée
                                    </h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                        {selectedMission.description || 'Aucune description fournie.'}
                                    </p>
                                </div>

                                {/* Skills */}
                                {(selectedMission.technicalSkills || selectedMission.businessSkills) && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">Compétences Requises</h3>
                                            {selectedMission.technicalSkills && selectedMission.technicalSkills.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-sm text-muted-foreground mb-2">Compétences techniques:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedMission.technicalSkills.map((skill, i) => (
                                                            <Badge key={i} variant="secondary">{skill}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {selectedMission.businessSkills && selectedMission.businessSkills.length > 0 && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-2">Compétences métiers:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedMission.businessSkills.map((skill, i) => (
                                                            <Badge key={i} variant="outline">{skill}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Visibility */}
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-primary" />
                                        Paramètres de Visibilité
                                    </h3>
                                    <div className="space-y-4 bg-secondary/20 p-4 rounded-lg">
                                        <div className="grid gap-4">
                                            {/* Visibility Mode */}
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">Mode de visibilité</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Contrôle qui peut voir cette mission
                                                    </p>
                                                </div>
                                                <Select
                                                    value={selectedMission.visibility_mode}
                                                    onValueChange={(value) => handleVisibilityChange('visibility_mode', value)}
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Publique">Publique</SelectItem>
                                                        <SelectItem value="Privée">Privée</SelectItem>
                                                        <SelectItem value="Restreinte">Restreinte</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {selectedMission.visibility_mode === 'Restreinte' && (
                                                <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                                                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                                                        Les missions en mode <strong>Restreint</strong> sont automatiquement en statut <strong>Brouillon</strong> et ne sont visibles que par invitation.
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            <Separator />

                                            {/* Company Name Visibility */}
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">Nom de l'entreprise visible</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Afficher le nom de votre entreprise publiquement
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={selectedMission.is_company_name_visible}
                                                    onCheckedChange={(value) => handleVisibilityChange('is_company_name_visible', value)}
                                                />
                                            </div>

                                            <Separator />

                                            {/* NDA Requirement */}
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5 flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4 text-primary" />
                                                    <div>
                                                        <Label className="text-base">NDA requis</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Exiger la signature d'un accord de confidentialité
                                                        </p>
                                                    </div>
                                                </div>
                                                <Switch
                                                    checked={selectedMission.require_nda}
                                                    onCheckedChange={(value) => handleVisibilityChange('require_nda', value)}
                                                />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Candidats à présélectionner:</span>
                                            <p className="font-medium mt-1">{selectedMission.num_consultants_preselect || 'Non spécifié'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => setDetailsOpen(false)}
                                >
                                    Fermer
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => setDeleteConfirmOpen(true)}
                                    disabled={selectedMission.status === 'Deleted'}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer la mission
                                </Button>
                            </div>
                        </>
                    ) : null}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="w-5 h-5" />
                            Confirmer la suppression
                        </DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette mission ? La mission sera déplacée vers les missions supprimées.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedMission && (
                        <div className="py-4">
                            <p className="font-semibold text-sm mb-2">Mission à supprimer:</p>
                            <p className="text-sm text-muted-foreground">{selectedMission.title}</p>
                        </div>
                    )}
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteConfirmOpen(false)}
                            disabled={deletingMission}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteMission}
                            disabled={deletingMission}
                        >
                            {deletingMission ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Suppression...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
