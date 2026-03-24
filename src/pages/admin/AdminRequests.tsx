
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    CheckCircle,
    XCircle,
    Building2,
    User,
    Mail,
    Phone,
    Calendar,
    Eye,
    Activity,
    ShieldAlert,
    FileText,
    Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api, STORAGE_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MissionDetails } from "@/components/missions/MissionDetails";

interface BaseRequest {
    id: string;
    created_at: string;
    status: string;
    type: 'company' | 'consultant';
}

interface CompanyRequest extends BaseRequest {
    type: 'company';
    company_name: string;
    legal_form: string;
    siret: string;
    main_sector: string;
    company_size: string;
    country: string;
    city: string;
    address: string;
    contact_first_name: string;
    contact_last_name: string;
    contact_position: string;
    email: string;
    phone: string;
    preferences_json: any;
}

interface ConsultantRequest extends BaseRequest {
    type: 'consultant';
    prenom: string;
    nom: string;
    email_professionnel: string;
    telephone: string;
    profile_data_json: any;
}

type AnyRequest = CompanyRequest | ConsultantRequest;

export default function AdminRequests() {
    const { toast } = useToast();
    const [companies, setCompanies] = useState<CompanyRequest[]>([]);
    const [consultants, setConsultants] = useState<ConsultantRequest[]>([]);
    const [missionApplications, setMissionApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMission, setSelectedMission] = useState<any | null>(null);
    const [isMissionDetailsOpen, setIsMissionDetailsOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<AnyRequest | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleViewMission = async (missionId: string) => {
        try {
            const res = await api.getMissionById(missionId);
            if (res.success) {
                setSelectedMission(res.mission);
                setIsMissionDetailsOpen(true);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger les détails de la mission."
            });
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [pendingRes, appsRes] = await Promise.all([
                api.getPendingRequests(),
                api.getAdminApplications()
            ]);

            if (pendingRes.success) {
                setCompanies((pendingRes.companies || []).map(c => ({ ...c, type: 'company' })));
                setConsultants((pendingRes.consultants || []).map(c => ({ ...c, type: 'consultant' })));
            }
            if (appsRes.success) {
                setMissionApplications(appsRes.applications || []);
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger les demandes."
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (id: string, type: 'company' | 'consultant') => {
        try {
            const response = type === 'company'
                ? await api.approveCompany(id)
                : await api.approveConsultant(id);

            if (response.success) {
                toast({
                    title: "Approuvé",
                    description: `${type === 'company' ? "L'entreprise" : "Le consultant"} a été approuvé avec succès.`
                });
                setIsDetailsOpen(false);
                fetchData();
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "L'approbation a échoué."
            });
        }
    };

    const handleReject = async (id: string, type: 'company' | 'consultant') => {
        if (!confirm("Êtes-vous sûr de vouloir rejeter cette demande ?")) return;

        try {
            const response = await api.rejectRequest(id, type);
            if (response.success) {
                toast({
                    title: "Rejeté",
                    description: "La demande a été supprimée."
                });
                setIsDetailsOpen(false);
                fetchData();
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Le rejet a échoué."
            });
        }
    };

    const handleValidateApplication = async (id: string, action: 'approve' | 'reject') => {
        try {
            const response = await api.validateApplication(id, action);
            if (response.success) {
                toast({
                    title: action === 'approve' ? "Validée" : "Refusée",
                    description: response.message
                });
                fetchData();
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "L'opération a échoué."
            });
        }
    };

    const openDetails = (request: any, type: 'company' | 'consultant') => {

        setSelectedRequest({ ...request, type });
        setIsDetailsOpen(true);
    };

    // Helper to render badges for array data
    const renderBadges = (data: string[] | string | undefined, color: 'blue' | 'emerald' | 'orange' | 'purple' | 'slate' = "blue") => {
        if (!data) return <span className="text-muted-foreground italic text-xs">Aucune information</span>;

        const items = Array.isArray(data) ? data : [data];

        const colorMap = {
            blue: "bg-blue-500/10 text-blue-600 border-blue-200/50 hover:bg-blue-500/20",
            emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50 hover:bg-emerald-500/20",
            orange: "bg-orange-500/10 text-orange-600 border-orange-200/50 hover:bg-orange-500/20",
            purple: "bg-purple-500/10 text-purple-600 border-purple-200/50 hover:bg-purple-500/20",
            slate: "bg-slate-500/10 text-slate-600 border-slate-200/50 hover:bg-slate-500/20"
        };

        return (
            <div className="flex flex-wrap gap-1 mt-1">
                {items.map((item, idx) => (
                    <Badge key={idx} variant="secondary" className={cn("px-2 py-0 text-[10px] border", colorMap[color])}>
                        {item}
                    </Badge>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Modération des Inscriptions</h1>
                <p className="text-muted-foreground">
                    Validez les nouvelles entreprises et consultants avant leur mise en ligne.
                </p>
            </div>

            <Tabs defaultValue="companies" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
                    <TabsTrigger value="companies" className="flex gap-2">
                        <Building2 className="w-4 h-4" />
                        Entreprises ({companies.length})
                    </TabsTrigger>
                    <TabsTrigger value="consultants" className="flex gap-2">
                        <User className="w-4 h-4" />
                        Consultants ({consultants.length})
                    </TabsTrigger>
                    <TabsTrigger value="applications" className="flex gap-2">
                        <Briefcase className="w-4 h-4" />
                        Participations ({missionApplications.length})
                    </TabsTrigger>
                </TabsList>


                <TabsContent value="companies" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Demandes Entreprises</CardTitle>
                            <CardDescription>
                                Entreprises en attente de validation de leur compte SIRET.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Entreprise</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Secteur</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {companies.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                Aucune demande en attente.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        companies.map((company) => (
                                            <TableRow key={company.id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold">{company.company_name}</span>
                                                        <span className="text-xs text-muted-foreground">{company.siret || "N/A"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-xs">
                                                        <span>{company.contact_first_name} {company.contact_last_name}</span>
                                                        <span className="text-muted-foreground">{company.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{company.main_sector}</Badge>
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    {company.created_at ? new Date(company.created_at).toLocaleDateString() : 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                            onClick={() => openDetails(company, 'company')}
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                                            onClick={() => handleApprove(company.id, 'company')}
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/5"
                                                            onClick={() => handleReject(company.id, 'company')}
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="consultants" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Demandes Consultants</CardTitle>
                            <CardDescription>
                                Profils de consultants à vérifier (Expérience, CV).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Consultant</TableHead>
                                        <TableHead>Infos</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {consultants.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                Aucune demande en attente.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        consultants.map((consultant) => (
                                            <TableRow key={consultant.id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold">{consultant.prenom} {consultant.nom}</span>
                                                        <span className="text-[10px] text-blue-600 font-medium">
                                                            {(() => {
                                                                const pData = typeof consultant.profile_data_json === 'string' ? JSON.parse(consultant.profile_data_json) : (consultant.profile_data_json || {});
                                                                return pData.metier || "Profil non défini";
                                                            })()}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">{consultant.email_professionnel}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs font-medium">{consultant.telephone}</span>
                                                        {(() => {
                                                            const pData = typeof consultant.profile_data_json === 'string' ? JSON.parse(consultant.profile_data_json) : (consultant.profile_data_json || {});
                                                            const all = [...(pData.outils || []), ...(pData.competences_cles || [])].slice(0, 3);
                                                            return all.length > 0 ? (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {all.map((tag, i) => (
                                                                        <Badge key={i} variant="outline" className="text-[9px] px-1 py-0 h-4 bg-muted/50">{tag}</Badge>
                                                                    ))}
                                                                    {all.length < (pData.outils?.length || 0) + (pData.competences_cles?.length || 0) && <span className="text-[9px] text-muted-foreground">...</span>}
                                                                </div>
                                                            ) : null;
                                                        })()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    {consultant.created_at ? new Date(consultant.created_at).toLocaleDateString() : 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                            onClick={() => openDetails(consultant, 'consultant')}
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                                            onClick={() => handleApprove(consultant.id, 'consultant')}
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/5"
                                                            onClick={() => handleReject(consultant.id, 'consultant')}
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="applications" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Participations aux Missions</CardTitle>
                            <CardDescription>
                                Demandes des consultants pour participer à des missions publiées.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Consultant</TableHead>
                                        <TableHead>Mission</TableHead>
                                        <TableHead>Entreprise</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {missionApplications.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                Aucune demande en attente.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        missionApplications.map((app) => (
                                            <TableRow key={app.id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold">{app.prenom} {app.nom}</span>
                                                        <span className="text-xs text-muted-foreground">{app.email_professionnel}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium">{app.mission_title}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span>{app.company_name}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={app.status === 'En attente d\'approbation Admin' ? 'outline' : 'secondary'}>
                                                        {app.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-primary hover:text-primary hover:bg-primary/5"
                                                            onClick={() => handleViewMission(app.mission_id)}
                                                            title="Voir les détails de la mission"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </Button>
                                                        {app.status === 'En attente d\'approbation Admin' && (
                                                            <>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                                                    onClick={() => handleValidateApplication(app.id, 'approve')}
                                                                >
                                                                    <CheckCircle className="w-5 h-5" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="text-destructive hover:text-destructive hover:bg-destructive/5"
                                                                    onClick={() => handleValidateApplication(app.id, 'reject')}
                                                                >
                                                                    <XCircle className="w-5 h-5" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            {selectedRequest?.type === 'company' ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
                            Détails de la demande
                        </DialogTitle>
                        <DialogDescription>
                            Vérifiez les informations complètes soumises par {selectedRequest?.type === 'company' ? 'l\'entreprise' : 'le consultant'}.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="space-y-6 py-4">
                            {(() => {
                                const pData = selectedRequest.type === 'consultant'
                                    ? (typeof selectedRequest.profile_data_json === 'string' ? JSON.parse(selectedRequest.profile_data_json) : (selectedRequest.profile_data_json || {}))
                                    : null;

                                const photoUrl = pData?.photo_profil?.[0]?.url || pData?.photo_url || pData?.photo;

                                return (
                                    <div className="flex flex-col md:flex-row gap-6 bg-muted/20 p-4 rounded-xl border border-muted">
                                        {photoUrl && (
                                            <div className="flex-shrink-0">
                                                <img src={photoUrl} alt="Profil" className="w-20 h-20 rounded-lg object-cover border-2 border-white shadow-sm" />
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-6 flex-grow">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                    {selectedRequest.type === 'company' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                    {selectedRequest.type === 'company' ? 'Nom / Raison Sociale' : 'Nom Complet Consultant'}
                                                </label>
                                                <div className="flex flex-col">
                                                    <p className="font-semibold text-lg text-blue-600">
                                                        {selectedRequest.type === 'company'
                                                            ? selectedRequest.company_name
                                                            : (pData && pData.prenom ? `${pData.prenom} ${pData.nom}` : (selectedRequest as any).prenom ? `${(selectedRequest as any).prenom} ${(selectedRequest as any).nom}` : "N/A")
                                                        }
                                                    </p>
                                                    {selectedRequest.type === 'consultant' && pData?.metier && (
                                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{pData.metier}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                    <Mail className="w-3 h-3" /> Email de contact
                                                </label>
                                                <p className="font-semibold text-lg">
                                                    {selectedRequest.type === 'company'
                                                        ? selectedRequest.email
                                                        : (pData && pData.email_professionnel ? pData.email_professionnel : (selectedRequest as any).email_professionnel)
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Section: Specific Info Graphical Display */}
                            {selectedRequest.type === 'company' ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-bold flex items-center gap-2 border-b pb-2">
                                                    <Activity className="w-4 h-4 text-blue-500" /> Identité Entreprise
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">SIRET</p>
                                                        <p className="font-medium">{selectedRequest.siret}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Forme Juridique</p>
                                                        <p className="font-medium">{selectedRequest.legal_form}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Secteur</p>
                                                        <Badge variant="outline">{selectedRequest.main_sector}</Badge>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Taille</p>
                                                        <p className="font-medium">{selectedRequest.company_size}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-sm font-bold flex items-center gap-2 border-b pb-2">
                                                    <Calendar className="w-4 h-4 text-emerald-500" /> Préférences de Collaboration
                                                </h4>
                                                {(() => {
                                                    const prefs = typeof selectedRequest.preferences_json === 'string'
                                                        ? JSON.parse(selectedRequest.preferences_json)
                                                        : (selectedRequest.preferences_json || {});

                                                    return (
                                                        <div className="space-y-4">
                                                            <div>
                                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Types de Missions</p>
                                                                {renderBadges(prefs.missionTypes || prefs.mission_types, "blue")}
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Modes de Travail</p>
                                                                {renderBadges(prefs.workMode || prefs.work_modes, "emerald")}
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Zones Cibles</p>
                                                                {renderBadges(prefs.targetZones || prefs.target_zones, "orange")}
                                                            </div>
                                                            {(prefs.contactPreferences || prefs.contact_preferences) && (
                                                                <div>
                                                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Préférences de Contact</p>
                                                                    {renderBadges(prefs.contactPreferences || prefs.contact_preferences, "purple")}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-3 p-4 bg-muted/10 rounded-lg border border-dashed h-full">
                                                <h4 className="text-sm font-bold flex items-center gap-2">
                                                    <User className="w-4 h-4 text-purple-500" /> Contact Responsable
                                                </h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="font-medium text-lg">{selectedRequest.contact_first_name} {selectedRequest.contact_last_name}</p>
                                                        <p className="text-sm text-muted-foreground">{selectedRequest.contact_position}</p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <div className="p-1.5 bg-blue-50 rounded-md">
                                                                <Phone className="w-3.5 h-3.5 text-blue-600" />
                                                            </div>
                                                            <span>{selectedRequest.phone}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <div className="p-1.5 bg-emerald-50 rounded-md">
                                                                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                                                            </div>
                                                            <span>{selectedRequest.email}</span>
                                                        </div>
                                                    </div>

                                                    <Separator className="my-2" />

                                                    <div className="space-y-2">
                                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Localisation Siège</p>
                                                        <div className="flex items-start gap-2 text-sm">
                                                            <Building2 className="w-4 h-4 mt-0.5 text-muted-foreground" />
                                                            <div>
                                                                <p>{selectedRequest.address}</p>
                                                                <p className="text-muted-foreground">{selectedRequest.city}, {selectedRequest.country}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Raw Data Accordion for Company */}
                                    <div className="mt-4 pt-4 border-t">
                                        <details className="group">
                                            <summary className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground flex items-center gap-2">
                                                <div className="w-4 h-4 flex items-center justify-center transition-transform group-open:rotate-90">▶</div>
                                                Voir les données brutes (JSON)
                                            </summary>
                                            <div className="mt-2 p-4 bg-slate-950 rounded-lg overflow-x-auto">
                                                <pre className="text-[10px] text-emerald-400 font-mono">
                                                    {JSON.stringify(selectedRequest, null, 2)}
                                                </pre>
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-bold flex items-center gap-2 border-b pb-2">
                                                    <ShieldAlert className="w-4 h-4 text-emerald-500" /> Profil Professionnel
                                                </h4>
                                                {(() => {
                                                    const pData = typeof selectedRequest.profile_data_json === 'string'
                                                        ? JSON.parse(selectedRequest.profile_data_json)
                                                        : (selectedRequest.profile_data_json || {});

                                                    return (
                                                        <div className="space-y-4 text-sm">
                                                            <div className="flex items-center gap-4 mb-4">
                                                                <Avatar className="h-16 w-16 border-2 border-emerald-100">
                                                                    <AvatarImage src={(pData as any).photo_profil_url ? `${STORAGE_URL}${(pData as any).photo_profil_url}` : undefined} />
                                                                    <AvatarFallback className="bg-emerald-50 text-emerald-600 font-bold">
                                                                        {selectedRequest.prenom?.charAt(0)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                {(pData as any).cv_url && (
                                                                    <a
                                                                        href={`${STORAGE_URL}${(pData as any).cv_url}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors text-xs font-medium"
                                                                    >
                                                                        <FileText className="w-4 h-4" />
                                                                        Consulter le CV
                                                                    </a>
                                                                )}
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground">Expertise</p>
                                                                    <div className="flex flex-col gap-1">
                                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 w-fit">
                                                                                {(pData as any).domaine || (pData as any).domaine_principal || "Non spécifié"}
                                                                            </Badge>
                                                                            {(pData as any).metier && (
                                                                                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 w-fit">
                                                                                    {(pData as any).metier}
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        {((pData as any).domaine === 'Autre' || (pData as any).domaine_principal === 'Autre') && (pData as any).domaine_autre && (
                                                                            <span className="text-xs font-medium text-emerald-600">{(pData as any).domaine_autre}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground">Expérience</p>
                                                                    <p className="font-medium">{(pData as any).experience_totale || "N/A"}</p>
                                                                    <p className="text-[10px] text-muted-foreground">Début: {(pData as any).annee_debut_activite || "N/A"}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground">TJM Souhaité</p>
                                                                    <p className="font-bold text-emerald-600">{(pData as any).tjm ? `${(pData as any).tjm} Dh` : "Non défini"}</p>
                                                                    {((pData as any).tjm_min || (pData as any).tjm_max) && (
                                                                        <p className="text-[10px] text-muted-foreground">Plage: {(pData as any).tjm_min || 0} - {(pData as any).tjm_max || '∞'} Dh</p>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground">Statut</p>
                                                                    <p className="font-medium">{(pData as any).statut_professionnel || "N/A"}</p>
                                                                    {(pData as any).identifiant_fiscal && (
                                                                        <p className="text-[10px] text-muted-foreground">IF: {(pData as any).identifiant_fiscal}</p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Disponibilité</p>
                                                                <div className="p-2 bg-slate-50 rounded border text-xs space-y-1">
                                                                    <p><span className="text-muted-foreground italic">Statut:</span> <span className="font-medium">{(pData as any).disponibilite_actuelle || "N/A"}</span></p>
                                                                    {(pData as any).date_disponibilite && (
                                                                        <p><span className="text-muted-foreground italic">Le:</span> <span className="font-medium">{new Date((pData as any).date_disponibilite).toLocaleDateString()}</span></p>
                                                                    )}
                                                                    {(pData as any).charge_disponible && (
                                                                        <p><span className="text-muted-foreground italic">Charge:</span> <span className="font-medium">{(pData as any).charge_disponible} j/semaine</span></p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Outils & Technologies</p>
                                                                {renderBadges((pData as any).outils || (pData as any).technicalSkills || (pData as any).skills || (pData as any).competences, "blue")}
                                                            </div>

                                                            <div>
                                                                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Compétences Clés</p>
                                                                {renderBadges((pData as any).competences_cles || (pData as any).businessSkills, "purple")}
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Modes de Travail</p>
                                                                    {renderBadges((pData as any).mode_travail_prefere, "orange")}
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Visibilité & Accords</p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        <Badge variant={(pData as any).autorisation_matching_ia ? "default" : "outline"} className={cn("text-[9px]", (pData as any).autorisation_matching_ia ? "bg-emerald-500" : "")}>
                                                                            IA: {(pData as any).autorisation_matching_ia ? "OUI" : "NON"}
                                                                        </Badge>
                                                                        <Badge variant={(pData as any).profil_public ? "default" : "outline"} className={cn("text-[9px]", (pData as any).profil_public ? "bg-blue-500" : "")}>
                                                                            Public: {(pData as any).profil_public ? "OUI" : "NON"}
                                                                        </Badge>
                                                                        <Badge variant={(pData as any).cgu_acceptees ? "default" : "outline"} className={cn("text-[9px]", (pData as any).cgu_acceptees ? "bg-purple-500" : "")}>
                                                                            CGU: {(pData as any).cgu_acceptees ? "OK" : "KO"}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-3 p-4 bg-muted/10 rounded-lg border border-dashed">
                                                <h4 className="text-sm font-bold flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-blue-500" /> Coordonnées & Social
                                                </h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-50 rounded-full">
                                                            <Phone className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Téléphone</p>
                                                            <p className="font-medium">{selectedRequest.telephone}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-emerald-50 rounded-full">
                                                            <Mail className="w-4 h-4 text-emerald-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Email</p>
                                                            <p className="font-medium truncate max-w-[200px]">{selectedRequest.email_professionnel}</p>
                                                        </div>
                                                    </div>
                                                    {(() => {
                                                        const pData = typeof selectedRequest.profile_data_json === 'string' ? JSON.parse(selectedRequest.profile_data_json) : (selectedRequest.profile_data_json || {});
                                                        return (
                                                            <>
                                                                {pData.linkedin && (
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="p-2 bg-slate-100 rounded-full">
                                                                            <Activity className="w-4 h-4 text-slate-600" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-muted-foreground">LinkedIn</p>
                                                                            <a href={pData.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate block max-w-[200px]">Profile LinkedIn</a>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {pData.site_web && (
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="p-2 bg-slate-100 rounded-full">
                                                                            <Activity className="w-4 h-4 text-slate-600" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-muted-foreground">Site Web</p>
                                                                            <a href={pData.site_web} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate block max-w-[200px]">{pData.site_web}</a>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>

                                            <div className="space-y-3 p-4 bg-muted/10 rounded-lg border">
                                                <h4 className="text-sm font-bold flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-indigo-500" /> Localisation
                                                </h4>
                                                {(() => {
                                                    const pData = typeof selectedRequest.profile_data_json === 'string' ? JSON.parse(selectedRequest.profile_data_json) : (selectedRequest.profile_data_json || {});
                                                    return (
                                                        <div className="space-y-1">
                                                            <p className="text-sm">{pData.adresse_complete || "N/A"}</p>
                                                            <p className="text-xs text-muted-foreground font-medium">{pData.ville || "N/A"}, {pData.pays_residence || "N/A"}</p>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            <div className="space-y-3 p-4 bg-muted/10 rounded-lg border">
                                                <h4 className="text-sm font-bold flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-orange-500" /> Document & Validation
                                                </h4>
                                                <div className="space-y-3">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
                                                        onClick={() => {
                                                            const pData = typeof selectedRequest.profile_data_json === 'string' ? JSON.parse(selectedRequest.profile_data_json) : (selectedRequest.profile_data_json || {});
                                                            if (pData.cv_url) {
                                                                window.open(pData.cv_url, '_blank');
                                                            } else {
                                                                toast({
                                                                    title: "Information",
                                                                    description: "Aucun CV n'est associé à cette demande."
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4" /> Consulter le CV
                                                    </Button>
                                                    <p className="text-[10px] text-center text-muted-foreground">
                                                        Soumis le {new Date(selectedRequest.created_at).toLocaleDateString()} à {new Date(selectedRequest.created_at).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Experiences for Consultant */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <h4 className="text-sm font-bold flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-purple-500" /> Expériences Professionnelles
                                        </h4>
                                        {(() => {
                                            const pData = typeof selectedRequest.profile_data_json === 'string' ? JSON.parse(selectedRequest.profile_data_json) : (selectedRequest.profile_data_json || {});
                                            const experiences = pData.experiences || [];

                                            if (experiences.length === 0) return <p className="text-xs italic text-muted-foreground">Aucune expérience détaillée fournie.</p>;

                                            return (
                                                <div className="space-y-3">
                                                    {experiences.map((exp: any, idx: number) => (
                                                        <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 relative overflow-hidden">
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-400"></div>
                                                            <div className="flex justify-between items-start">
                                                                <h5 className="font-bold text-sm">{exp.poste || exp.title}</h5>
                                                                <span className="text-[10px] font-medium bg-white px-2 py-0.5 rounded-full border border-slate-200">{exp.duree || exp.duration}</span>
                                                            </div>
                                                            <p className="text-xs font-medium text-purple-600">{exp.entreprise || exp.company}</p>
                                                            {exp.description && (
                                                                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 hover:line-clamp-none transition-all cursor-default">
                                                                    {exp.description}
                                                                </p>
                                                            )}
                                                            {exp.technos && (
                                                                <div className="flex flex-wrap gap-1 mt-2">
                                                                    {Array.isArray(exp.technos) ? exp.technos.map((t: string, i: number) => (
                                                                        <span key={i} className="text-[9px] bg-white border px-1.5 rounded text-slate-500">{t}</span>
                                                                    )) : null}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Raw Data Accordion for Consultant */}
                                    <div className="pt-4 border-t">
                                        <details className="group">
                                            <summary className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground flex items-center gap-2">
                                                <div className="w-4 h-4 flex items-center justify-center transition-transform group-open:rotate-90">▶</div>
                                                Voir les données brutes (JSON)
                                            </summary>
                                            <div className="mt-2 p-4 bg-slate-950 rounded-lg overflow-x-auto">
                                                <pre className="text-[10px] text-emerald-400 font-mono">
                                                    {JSON.stringify(selectedRequest, null, 2)}
                                                </pre>
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => handleReject(selectedRequest.id, selectedRequest.type)}
                                    className="text-destructive border-destructive/20 hover:bg-destructive/10 px-6"
                                >
                                    Rejeter
                                </Button>
                                <Button
                                    onClick={() => handleApprove(selectedRequest.id, selectedRequest.type)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 px-8 font-bold"
                                >
                                    Approuver & Activer
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isMissionDetailsOpen} onOpenChange={setIsMissionDetailsOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Briefcase className="w-5 h-5 text-primary" />
                            Détails de la mission concernée
                        </DialogTitle>
                    </DialogHeader>
                    {selectedMission && (
                        <MissionDetails
                            mission={selectedMission}
                            onClose={() => setIsMissionDetailsOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
