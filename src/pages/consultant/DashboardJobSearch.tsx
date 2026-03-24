
import { useState, useEffect } from "react";
import { useTaxonomy } from "@/hooks/useTaxonomy";
import { Search, MapPin, Briefcase, Filter, Calendar, Clock, Euro, CheckCircle2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MissionDetails } from "@/components/missions/MissionDetails";

export default function DashboardJobSearch() {
    const { taxonomy } = useTaxonomy();
    const [selectedDomain, setSelectedDomain] = useState("");
    const [selectedJob, setSelectedJob] = useState("");
    const [missions, setMissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [applyingId, setApplyingId] = useState<string | null>(null);
    const [selectedMission, setSelectedMission] = useState<any>(null);

    useEffect(() => {
        initializeData();
    }, []);

    const initializeData = async () => {
        setLoading(true);
        try {
            // First fetch profile to get domain/job
            const profileRes = await api.getMe();
            if (profileRes.success && profileRes.user.role === 'consultant') {
                if (profileRes.user.domaine) {
                    setSelectedDomain(profileRes.user.domaine);
                }
                if (profileRes.user.metier) {
                    setSelectedJob(profileRes.user.metier);
                }
            }

            // Then fetch missions
            const missionsRes = await api.getITMissions();
            if (missionsRes.success) {
                setMissions(missionsRes.missions || missionsRes.data || []);
            }
        } catch (error) {
            console.error("Initialization error:", error);
            toast.error("Erreur lors de l'initialisation des données.");
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (missionId: string) => {
        setApplyingId(missionId);
        try {
            const response = await api.applyToMission(missionId);
            if (response.success) {
                toast.success(response.message || "Votre candidature a été envoyée !");
                setSelectedMission(null);
            } else {
                toast.error(response.message || "Erreur lors de la postulation.");
            }
        } catch (error) {
            toast.error("Une erreur est survenue.");
        } finally {
            setApplyingId(null);
        }
    };

    const filteredMissions = missions.filter(m => {
        const titleMatch = m.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const summaryMatch = m.summary?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearch = !searchTerm || titleMatch || summaryMatch;
        const matchesDomain = selectedDomain ? (m.selected_domain === selectedDomain || m.domaine === selectedDomain) : true;
        const matchesJob = selectedJob ? (m.selected_job === selectedJob || m.metier === selectedJob) : true;
        return matchesSearch && matchesDomain && matchesJob;
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Missions recommandées pour vous</h1>
                    <p className="text-muted-foreground">
                        Voici les opportunités qui correspondent à votre profil de {selectedJob || 'consultant'}.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto">
                <div className="space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Clock className="h-8 w-8 animate-spin mb-2" />
                            <p>Chargement des missions...</p>
                        </div>
                    ) : filteredMissions.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/5">
                            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-bold">Aucune mission trouvée</h3>
                            <p className="text-muted-foreground">Nous n'avons pas trouvé de missions correspondant à vos critères.</p>
                        </div>
                    ) : (
                        filteredMissions.map((mission) => (
                            <Card key={mission.id} className="hover:shadow-md transition-all duration-300 border-l-4 border-l-primary/30 hover:border-l-primary group">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="secondary" className="font-medium text-[10px] uppercase tracking-wider">
                                                    {mission.selected_domain || mission.domaine}
                                                </Badge>
                                                {new Date(mission.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                                                    <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-[10px] uppercase">Récent</Badge>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-xl text-primary leading-tight group-hover:text-primary/80 transition-colors">{mission.title}</h3>
                                            <p className="text-sm font-medium text-muted-foreground mt-1 flex items-center gap-1.5">
                                                <Building2 className="w-3.5 h-3.5" />
                                                {mission.company_name || 'Entreprise Confidentielle'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-primary font-bold">
                                                <Euro className="h-4 w-4" />
                                                <span>{mission.budget_min}€ - {mission.budget_max}€</span>
                                                <span className="text-xs font-normal text-muted-foreground ml-1">/ jour</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                                        {mission.summary}
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="p-1.5 bg-muted rounded-md group-hover:bg-primary/5 transition-colors">
                                                <MapPin className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="truncate">{mission.city}, {mission.country}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="p-1.5 bg-muted rounded-md group-hover:bg-primary/5 transition-colors">
                                                <Clock className="h-4 w-4 text-primary" />
                                            </div>
                                            <span>{mission.estimated_duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="p-1.5 bg-muted rounded-md group-hover:bg-primary/5 transition-colors">
                                                <Briefcase className="h-4 w-4 text-primary" />
                                            </div>
                                            <span>{mission.work_mode}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="p-1.5 bg-muted rounded-md group-hover:bg-primary/5 transition-colors">
                                                <Calendar className="h-4 w-4 text-primary" />
                                            </div>
                                            <span>Dès le {mission.start_date ? format(new Date(mission.start_date), 'dd/MM', { locale: fr }) : 'ASAP'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2 flex justify-between border-t bg-muted/5 py-4">
                                    <div className="text-xs text-muted-foreground italic">
                                        Publiée le {mission.created_at ? format(new Date(mission.created_at), 'dd MMMM yyyy', { locale: fr }) : 'N/A'}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="h-9" onClick={() => setSelectedMission(mission)}>Détails</Button>
                                        <Button
                                            size="sm"
                                            className="h-9 px-6 bg-primary hover:bg-primary/90"
                                            onClick={() => handleApply(mission.id)}
                                            disabled={applyingId === mission.id}
                                        >
                                            {applyingId === mission.id ? (
                                                <Clock className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                            )}
                                            Postuler
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            <Dialog open={!!selectedMission} onOpenChange={() => setSelectedMission(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    {selectedMission && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-xl">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                    Proposition de mission
                                </DialogTitle>
                                <DialogDescription>
                                    Consultez les détails complets du besoin exprimé par l'entreprise.
                                </DialogDescription>
                            </DialogHeader>
                            <MissionDetails
                                mission={selectedMission}
                                onClose={() => setSelectedMission(null)}
                                onApply={handleApply}
                                showApplyButton={true}
                                isApplying={applyingId === selectedMission.id}
                            />
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
