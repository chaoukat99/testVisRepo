
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User as UserIcon, Mail, Phone, Calendar, MapPin,
    Shield, Briefcase, FileText, Globe, Linkedin,
    ExternalLink, Settings, Ban, CheckCircle
} from "lucide-react";
import { STORAGE_URL } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ConsultantProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onToggleStatus?: (user: any) => void;
}

export function ConsultantProfileDialog({ isOpen, onClose, user, onToggleStatus }: ConsultantProfileDialogProps) {
    if (!user) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
            case 'Suspended': return 'bg-red-500/10 text-red-600 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const fullName = user.name || `${user.prenom} ${user.nom}`;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                        <UserIcon className="w-7 h-7 text-emerald-500" />
                        Profil Consultant
                    </DialogTitle>
                    <DialogDescription>
                        Informations complètes du compte consultant #{user.id?.slice(0, 8)}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-8 py-4">
                    {/* Identity Header */}
                    <div className="flex flex-col sm:flex-row items-start gap-6 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                            <AvatarImage src={user.photo_profil_url ? `${STORAGE_URL}${user.photo_profil_url}` : undefined} />
                            <AvatarFallback className="text-2xl font-bold text-white bg-emerald-600">
                                {fullName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-2xl font-bold text-emerald-950">{fullName}</h3>
                                    <div className="flex items-center gap-2">
                                        {user.profile_type && (
                                            <Badge className="w-fit bg-purple-500/10 text-purple-600 border-purple-200 font-bold text-xs">
                                                {user.profile_type}
                                            </Badge>
                                        )}
                                        {user.metier && (
                                            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide">{user.metier}</p>
                                        )}
                                    </div>
                                </div>
                                <Badge className={cn("border px-3 py-1 w-fit", getStatusColor(user.status))}>
                                    {user.status || 'Active'}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Mail className="w-4 h-4 text-emerald-500" /> {user.email_professionnel || user.email}
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Phone className="w-4 h-4 text-emerald-500" /> {user.telephone || "N/A"}
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Calendar className="w-4 h-4 text-emerald-500" /> Inscrit le {new Date(user.created_at || user.joined).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Professional Details */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> Expertise & Tarifs
                                </h4>
                                <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border">
                                    <div className="col-span-2">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Domaine</p>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                <Badge className="w-fit bg-emerald-500/10 text-emerald-600 border-emerald-200">
                                                    {user.domaine || "Non spécifié"}
                                                </Badge>
                                            </div>
                                            {user.domaine === 'Autre' && user.domaine_autre && (
                                                <p className="text-xs font-medium text-emerald-600 pl-1">{user.domaine_autre}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Expérience</p>
                                        <p className="text-sm font-semibold">{user.experience_totale || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">TJM</p>
                                        <p className="text-sm font-bold text-emerald-600">{user.tjm ? `${user.tjm} Dh/j` : "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Statut Pro</p>
                                        <p className="text-sm font-semibold">{user.statut_professionnel || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                        <Settings className="w-4 h-4" /> Outils & Compétences
                                    </h4>

                                    {user.outils && user.outils.length > 0 && (
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Outils</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {user.outils.map((tool: string, idx: number) => (
                                                    <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                                                        {tool}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {user.competences_cles && user.competences_cles.length > 0 && (
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Compétences</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {user.competences_cles.map((skill: string, idx: number) => (
                                                    <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" /> Expériences
                                    </h4>
                                    {user.experiences && user.experiences.length > 0 ? (
                                        <div className="space-y-4">
                                            {user.experiences.map((exp: any, idx: number) => (
                                                <div key={idx} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm space-y-2">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h5 className="font-bold text-slate-900 text-sm">{exp.titre_mission}</h5>
                                                            <p className="text-[10px] font-medium text-blue-600">{exp.client} {exp.secteur ? `• ${exp.secteur}` : ''}</p>
                                                        </div>
                                                        <Badge variant="outline" className="text-[9px] bg-slate-50 h-5">
                                                            {exp.date_debut ? new Date(exp.date_debut).getFullYear() : ''} - {exp.date_fin ? new Date(exp.date_fin).getFullYear() : 'Présent'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">{exp.description_courte}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs italic text-slate-400 bg-slate-50 p-4 rounded-xl border border-dashed">Aucune expérience renseignée</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Localization & Social & Documents */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Localisation
                                </h4>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium">{user.adresse_complete || "Adresse non renseignée"}</p>
                                            <p className="text-xs text-slate-500">{user.ville || user.city}, {user.pays_residence || user.country}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> Liens
                                </h4>
                                <div className="space-y-3">
                                    {user.linkedin ? (
                                        <a
                                            href={user.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-white border rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all group"
                                        >
                                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                                                <Linkedin className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">Profil LinkedIn</span>
                                        </a>
                                    ) : (
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-dashed rounded-xl opacity-60">
                                            <div className="p-2 bg-slate-200 rounded-lg text-slate-400">
                                                <Linkedin className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs italic text-slate-400">Aucun lien LinkedIn</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Documents
                                </h4>
                                {user.cv_url ? (
                                    <a
                                        href={`${STORAGE_URL}${user.cv_url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-500 rounded-lg text-white">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-emerald-900 uppercase">Curriculum Vitae</p>
                                                <p className="text-[10px] text-emerald-600">Cliquez pour visualiser le CV</p>
                                            </div>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600" />
                                    </a>
                                ) : (
                                    <div className="p-8 bg-muted/20 rounded-xl text-center border border-dashed">
                                        <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
                                        <p className="text-xs italic text-slate-400">Aucun CV déposé</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 pt-4">
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Disponibilité</p>
                                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-sm">
                                    <p className="font-bold text-emerald-800">{user.disponibilite_actuelle || "N/A"}</p>
                                    {user.charge_disponible && <p className="text-xs text-emerald-600 font-medium">Charge: {user.charge_disponible}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            Fermer
                        </Button>
                        {onToggleStatus && (
                            <Button
                                variant={user.status === 'Active' ? "destructive" : "default"}
                                className="gap-2"
                                onClick={() => onToggleStatus(user)}
                            >
                                {user.status === 'Active' ? (
                                    <>
                                        <Ban className="w-4 h-4" /> Suspendre le compte
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" /> Réactiver le compte
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    );
}
