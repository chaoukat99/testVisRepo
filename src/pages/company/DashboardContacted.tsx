
import React, { useState, useEffect } from 'react';
import { api, STORAGE_URL } from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Search,
    MessageSquare,
    User,
    MapPin,
    Briefcase,
    Star,
    Zap,
    Mail,
    ExternalLink,
    Loader2,
    Users
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DashboardContacted() {
    const [contacted, setContacted] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        fetchContacted();
    }, []);

    const fetchContacted = async () => {
        try {
            setLoading(true);
            const response = await api.getConversations();
            if (response.success) {
                // In conversations, if the current user is a company, 
                // the other participant is the consultant.
                setContacted(response.conversations || []);
            }
        } catch (error) {
            console.error('Failed to fetch contacted consultants', error);
            toast.error("Erreur lors du chargement des contacts");
        } finally {
            setLoading(false);
        }
    };

    const viewDetails = async (consultantId: string) => {
        try {
            setLoadingDetails(true);
            // We need to find the consultant ID. In the conversation object, 
            // we have the info but maybe not the consultant_id explicitly in the frontend response row?
            // Let's assume the conversation object has enough or we can find it.
            // Wait, looking at ChatList.tsx, conversation has prenom, nom, etc.
            // But we need the consultant ID to fetch full details.

            // Looking at the controller (searchConsultants), it returns c.id.
            // Let's check getConversations in the backend.
            const response = await api.getConsultantById(consultantId);
            if (response.success) {
                setSelectedConsultant(response.consultant);
            }
        } catch (error) {
            toast.error("Impossible de charger les détails du profil");
        } finally {
            setLoadingDetails(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight italic flex items-center gap-3">
                        <Users className="size-8 text-primary" /> Consultants Contactés
                    </h2>
                    <p className="text-slate-500 font-medium">
                        Retrouvez ici tous les talents avec qui vous avez initié une discussion.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                    <span className="text-2xl font-black text-primary">{contacted.length}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-tight">Relations<br />Actives</span>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                    <Loader2 className="size-12 text-primary animate-spin mb-4" />
                    <p className="text-slate-500 font-medium italic">Chargement de vos contacts...</p>
                </div>
            ) : contacted.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contacted.map((contact) => {
                        // In the conversation response, we might need to verify the fields. 
                        // Usually it's consultant_id or similar. 
                        // Let's assume 'id' here is the conversation ID, but we need participant info.
                        const name = `${contact.prenom} ${contact.nom}`;

                        return (
                            <Card key={contact.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-none shadow-xl bg-white/50 backdrop-blur-sm group">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16 border-2 border-white shadow-lg rounded-2xl">
                                            <AvatarImage src={contact.photo_profil_url ? `${STORAGE_URL}${contact.photo_profil_url}` : undefined} />
                                            <AvatarFallback className="bg-primary text-white font-bold text-2xl rounded-2xl">
                                                {contact.prenom?.[0]}{contact.nom?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <CardTitle className="text-lg font-bold truncate group-hover:text-primary transition-colors">
                                                {name}
                                            </CardTitle>
                                            <CardDescription className="text-xs font-semibold uppercase text-primary/70 tracking-tighter">
                                                {contact.metier || "Consultant"}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4 pt-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                            <span>Dernier contact</span>
                                            <span>{contact.last_message_at ? format(new Date(contact.last_message_at), 'dd MMM yyyy', { locale: fr }) : 'N/A'}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 line-clamp-2 italic bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                                            "{contact.last_message || 'Nouvelle conversation'}"
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 flex items-center gap-2 p-4 border-t bg-slate-50/50">
                                    <Button
                                        variant="outline"
                                        className="flex-1 rounded-full font-bold border-slate-200 hover:bg-white"
                                        onClick={() => viewDetails(contact.consultant_id)}
                                    >
                                        Profil
                                    </Button>
                                    <Button
                                        className="flex-1 rounded-full font-bold shadow-lg shadow-primary/20"
                                        asChild
                                    >
                                        <a href={`/company/conversations?chat=${contact.id}&title=${encodeURIComponent(name)}&subtitle=${encodeURIComponent(contact.metier || '')}`}>
                                            Message
                                        </a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="col-span-full text-center py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <div className="max-w-md mx-auto space-y-6">
                        <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Users className="h-12 w-12 text-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 italic">Aucun contact pour le moment</h3>
                            <p className="text-slate-500 font-medium">
                                Vous n'avez pas encore contacté de consultants. Explorez notre base de talents pour démarrer une collaboration.
                            </p>
                        </div>
                        <Button className="rounded-full px-8 font-bold" asChild>
                            <a href="/company/search-talents">Rechercher des talents</a>
                        </Button>
                    </div>
                </div>
            )}

            {/* Profil Details Modal (Reusing logic from SearchTalents) */}
            <Dialog open={!!selectedConsultant} onOpenChange={() => setSelectedConsultant(null)}>
                <DialogContent className="max-w-4xl h-[90vh] p-0 border-none shadow-2xl overflow-hidden rounded-[2.5rem] flex flex-col">
                    {selectedConsultant && (
                        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
                            {/* Re-using the premium details view style */}
                            <div className="bg-slate-900 p-8 text-white relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Zap className="size-32" />
                                </div>
                                <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                                    <Avatar className="h-24 w-24 border-4 border-white/20 shadow-2xl rounded-2xl">
                                        <AvatarImage src={selectedConsultant.photo_profil_url ? `${STORAGE_URL}${selectedConsultant.photo_profil_url}` : undefined} />
                                        <AvatarFallback className="bg-primary text-white text-3xl font-black rounded-2xl">
                                            {selectedConsultant.prenom[0]}{selectedConsultant.nom[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h2 className="text-4xl font-black italic tracking-tight">{selectedConsultant.prenom} {selectedConsultant.nom}</h2>
                                            <Badge className="bg-emerald-500 text-white border-none font-bold">Disponible</Badge>
                                        </div>
                                        <p className="text-xl text-slate-300 font-medium flex items-center gap-2">
                                            {selectedConsultant.metier} <span className="text-primary italic">@{selectedConsultant.domaine}</span>
                                        </p>
                                        <div className="flex gap-4 pt-4">
                                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                                                <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">TJM Indicatif</p>
                                                <p className="text-lg font-black">{selectedConsultant.tjm}€ <span className="text-xs font-normal opacity-60">/jour</span></p>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                                                <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Expérience</p>
                                                <p className="text-lg font-black">{selectedConsultant.experience_totale} Ans</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 grid md:grid-cols-3 gap-8 bg-slate-50">
                                <div className="md:col-span-1 space-y-6">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                                            <Star className="size-4" /> Expertise Globale
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Domaine</p>
                                                <p className="font-bold text-slate-900">{selectedConsultant.domaine || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Profession</p>
                                                <p className="font-bold text-slate-700">{selectedConsultant.metier || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                                        <h4 className="font-black text-sm uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <MapPin className="size-4 text-primary" /> Localisation
                                        </h4>
                                        <p className="font-bold text-slate-700">{selectedConsultant.ville}, {selectedConsultant.pays_residence}</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                                        <h4 className="font-black text-sm uppercase tracking-widest text-slate-400">Compétences</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedConsultant.competences_cles?.map((skill: string) => (
                                                <Badge key={skill} className="bg-blue-50 text-blue-700 border-blue-100 font-bold">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-8">
                                    <section className="space-y-4">
                                        <h3 className="text-xl font-bold text-slate-900 border-b pb-2">Parcours Professionnel</h3>
                                        <div className="space-y-6">
                                            {selectedConsultant.experiences?.length > 0 ? selectedConsultant.experiences.map((exp: any, idx: number) => (
                                                <div key={idx} className="relative pl-8 border-l-2 border-slate-200">
                                                    <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                                                    <div className="space-y-1">
                                                        <h5 className="font-bold text-slate-900 text-lg leading-tight">{exp.titre_mission}</h5>
                                                        <p className="text-sm font-bold text-primary flex items-center gap-2">
                                                            <span>{exp.client}</span>
                                                            <span className="text-slate-300">•</span>
                                                            <span className="text-slate-500 font-medium italic">{exp.secteur}</span>
                                                        </p>
                                                        <p className="text-sm text-slate-600 leading-relaxed mt-2">{exp.description_courte}</p>
                                                    </div>
                                                </div>
                                            )) : (
                                                <p className="text-sm text-muted-foreground italic">Aucune expérience renseignée.</p>
                                            )}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
