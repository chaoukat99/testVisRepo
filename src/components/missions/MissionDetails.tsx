
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Clock,
    MapPin,
    Building2,
    Briefcase,
    Euro,
    CheckCircle2,
    Lock,
    Eye,
    Loader2
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MissionDetailsProps {
    mission: any;
    onClose: () => void;
    onApply?: (missionId: string) => void;
    showApplyButton?: boolean;
    footerActions?: React.ReactNode;
    isApplying?: boolean;
}

export const MissionDetails: React.FC<MissionDetailsProps> = ({
    mission,
    onClose,
    onApply,
    showApplyButton = false,
    footerActions,
    isApplying = false
}) => {
    if (!mission) return null;

    const formatBudget = (min: any, max: any) => {
        if (!min && !max) return "À discuter";
        if (min && max) return `${min} - ${max} €`;
        return `${min || max} €`;
    };

    return (
        <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-primary">{mission.title}</h2>
                <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm font-medium">{mission.company_name || 'Entreprise Confidentielle'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">{mission.city || mission.location || 'Non spécifié'} {mission.work_mode ? `(${mission.work_mode})` : ''}</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center gap-2 text-blue-600">
                        <Euro className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Budget</span>
                    </div>
                    <p className="text-sm font-bold">{formatBudget(mission.budget_min, mission.budget_max)}</p>
                </div>
                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center gap-2 text-purple-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Démarrage</span>
                    </div>
                    <p className="text-sm font-bold">
                        {mission.start_date ? format(new Date(mission.start_date), 'dd MMMM yyyy', { locale: fr }) : 'ASAP'}
                    </p>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Durée</span>
                    </div>
                    <p className="text-sm font-bold">{mission.estimated_duration || 'Non spécifié'}</p>
                </div>
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center gap-2 text-amber-600">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Contrat</span>
                    </div>
                    <p className="text-sm font-bold">{mission.contract_type || 'N/A'}</p>
                </div>
            </div>

            {/* Content Tabs/Sections */}
            <div className="space-y-6">
                <div className="space-y-3">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-primary border-b pb-2">Description du besoin</h4>
                    <p className="text-sm font-medium leading-relaxed bg-muted/20 p-3 rounded-lg border italic">
                        {mission.summary || 'Aucun résumé disponible'}
                    </p>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground prose prose-sm max-w-none">
                        {mission.description}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h4 className="font-bold text-sm uppercase tracking-wider text-primary border-b pb-2 flex items-center gap-2">
                                expertise requise
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Séniorité</p>
                                    <p className="text-sm font-medium">{mission.seniority_level || 'Non spécifié'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Expérience min.</p>
                                    <p className="text-sm font-medium">{mission.min_experience_category || 'Non spécifié'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Domaine</p>
                                    <p className="text-sm font-medium">{mission.selected_domain || mission.domaine || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Métier</p>
                                    <p className="text-sm font-medium">{mission.selected_job || mission.metier || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-sm uppercase tracking-wider text-primary border-b pb-2 flex items-center gap-2">
                                Contrat & Facturation
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Nature</p>
                                    <p className="text-sm font-medium">{mission.contract_type || 'Non spécifié'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Facturation</p>
                                    <p className="text-sm font-medium">{mission.billing_mode || 'Non spécifié'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Type rém.</p>
                                    <p className="text-sm font-medium">{mission.remuneration_type || 'Non spécifié'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Charge estimée</p>
                                    <p className="text-sm font-medium">{mission.workload || 'Non spécifié'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h4 className="font-bold text-sm uppercase tracking-wider text-primary border-b pb-2">
                                Compétences & Documents
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Compétences Techniques</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {mission.technical_skills?.map((s: string) => (
                                            <Badge key={s} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 text-[10px]">{s}</Badge>
                                        ))}
                                        {(!mission.technical_skills || mission.technical_skills.length === 0) && <span className="text-xs italic text-muted-foreground">Aucune mentionnée</span>}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Compétences Métier</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {mission.business_skills?.map((s: string) => (
                                            <Badge key={s} variant="secondary" className="bg-purple-50 text-purple-700 border-purple-100 text-[10px]">{s}</Badge>
                                        ))}
                                        {(!mission.business_skills || mission.business_skills.length === 0) && <span className="text-xs italic text-muted-foreground">Aucune mentionnée</span>}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Documents Requis</p>
                                    <div className="flex flex-wrap gap-2">
                                        {mission.required_docs?.map((doc: string) => (
                                            <Badge key={doc} variant="outline" className="text-[10px] flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {doc}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-sm uppercase tracking-wider text-primary border-b pb-2">
                                informations Clés
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date limite</p>
                                    <p className="text-sm font-medium">
                                        {mission.deadline ? format(new Date(mission.deadline), 'dd/MM/yyyy', { locale: fr }) : 'Non spécifié'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Visibilité</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Eye className="w-3 h-3 text-blue-500" />
                                        <Badge variant="outline" className="text-[10px]">{mission.visibility_mode || 'Publique'}</Badge>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Profils recherchés</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {mission.consultant_types?.map((type: string) => (
                                            <Badge key={type} variant="outline" className="text-[10px] px-1 py-0">{type}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Confidentialité</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Lock className={`w-3 h-3 ${mission.require_nda ? 'text-amber-500' : 'text-emerald-500'}`} />
                                        <span className="text-xs font-medium">{mission.require_nda ? 'NDA Requis' : 'Standard'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                {footerActions ? (
                    footerActions
                ) : (
                    <>
                        <Button variant="outline" onClick={onClose}>Fermer</Button>
                        {showApplyButton && onApply && (
                            <Button onClick={() => onApply(mission.id)} disabled={isApplying}>
                                {isApplying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {isApplying ? 'Candidature...' : 'Postuler maintenant'}
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
