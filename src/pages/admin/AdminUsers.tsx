import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
    Search,
    MoreHorizontal,
    Shield,
    Ban,
    CheckCircle,
    User as UserIcon,
    Building2,
    Mail,
    Phone,
    MapPin,
    Activity,
    FileText,
    Briefcase,
    Calendar,
    Globe,
    Linkedin,
    Trash2,
    Settings,
    ExternalLink
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useEffect, useState } from "react";
import { api, STORAGE_URL } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.getUsers();
            if (response.success) {
                setUsers(response.users);
                console.log(response.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (user: any) => {
        try {
            const response = await api.toggleUserStatus(user.id, user.role, user.status);
            if (response.success) {
                toast({
                    title: "Statut mis à jour",
                    description: response.message,
                });
                fetchUsers();
                if (selectedUser?.id === user.id) {
                    setSelectedUser({ ...selectedUser, status: response.newStatus });
                }
            } else {
                toast({
                    title: "Erreur",
                    description: response.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la mise à jour du statut.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteUser = async (user: any) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement ${user.name || user.email} ? Cette action est irréversible.`)) {
            return;
        }

        try {
            const response = await api.deleteUser(user.id, user.role);
            if (response.success) {
                toast({
                    title: "Utilisateur supprimé",
                    description: "Le compte a été supprimé définitivement."
                });
                fetchUsers();
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: response.message
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "La suppression a échoué."
            });
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email_professionnel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.metier?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.competences_cles && user.competences_cles.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (user.outils && user.outils.some((o: string) => o.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
            case 'Suspended': return 'bg-red-500/10 text-red-600 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
                    <p className="text-muted-foreground">Administrez les comptes consultants et entreprises actifs sur la plateforme.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchUsers} disabled={isLoading}>
                        Rafraîchir
                    </Button>
                    <Button>
                        <Shield className="mr-2 h-4 w-4" /> Logs d'accès
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl font-bold">Base Utilisateurs</CardTitle>
                            <CardDescription>Visualisez et gérez les {users.length} comptes inscrits.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom ou email..."
                                className="pl-9 bg-white/50 border-muted-foreground/20 focus:bg-white transition-colors"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border border-muted overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="font-bold">Utilisateur</TableHead>
                                    <TableHead className="font-bold">Type de Compte</TableHead>
                                    <TableHead className="font-bold">Statut</TableHead>
                                    <TableHead className="font-bold">Date d'inscription</TableHead>
                                    <TableHead className="text-right font-bold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Chargement des utilisateurs...</TableCell>
                                    </TableRow>
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Aucun utilisateur trouvé.</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-muted/20 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                                        <AvatarImage src={user.photo_profil_url ? `${STORAGE_URL}${user.photo_profil_url}` : undefined} />
                                                        <AvatarFallback className={cn(
                                                            "text-white font-bold",
                                                            user.role === 'Company' ? "bg-blue-500" : "bg-emerald-500"
                                                        )}>
                                                            {user.name?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm">{user.name}</span>
                                                        {user.role === 'Consultant' && user.metier && (
                                                            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-tight leading-none mb-1">
                                                                {user.metier}
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Mail className="w-3 h-3" /> {user.role == "Consultant" ? user.email_professionnel : user.email}
                                                        </span>
                                                        {user.role === 'Consultant' && (user.competences_cles?.length > 0 || user.outils?.length > 0) && (
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {[...(user.competences_cles || []), ...(user.outils || [])].slice(0, 3).map((tag, i) => (
                                                                    <Badge key={i} variant="outline" className="text-[8px] px-1 py-0 h-3 bg-muted/30 border-transparent">{tag}</Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {user.role === 'Company' ? <Building2 className="w-4 h-4 text-blue-500" /> : <UserIcon className="w-4 h-4 text-emerald-500" />}
                                                    <Badge variant="outline" className={cn(
                                                        "font-medium",
                                                        user.role === 'Company' ? "border-blue-200 text-blue-700 bg-blue-50" : "border-emerald-200 text-emerald-700 bg-emerald-50"
                                                    )}>
                                                        {user.role === 'Company' ? 'Entreprise' : 'Consultant'}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={cn("border font-medium", getStatusColor(user.status))}>
                                                    {user.status === 'Active' ? 'Actif' : 'Suspendu'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">
                                                {new Date(user.joined).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setIsDetailsOpen(true);
                                                        }}
                                                        className="hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        Détails
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem onClick={() => {
                                                                setSelectedUser(user);
                                                                setIsDetailsOpen(true);
                                                            }}>
                                                                <Activity className="mr-2 h-4 w-4" /> Voir profil complet
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Shield className="mr-2 h-4 w-4" /> Modifier permissions
                                                            </DropdownMenuItem>
                                                            <Separator className="my-1" />
                                                            <DropdownMenuItem
                                                                className={user.status === 'Active' ? "text-red-600" : "text-emerald-600"}
                                                                onClick={() => handleToggleStatus(user)}
                                                            >
                                                                {user.status === 'Active' ? (
                                                                    <>
                                                                        <Ban className="mr-2 h-4 w-4" /> Suspendre le compte
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CheckCircle className="mr-2 h-4 w-4" /> Réactiver le compte
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-700 font-bold"
                                                                onClick={() => handleDeleteUser(user)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer définitivement
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* User Details Modal */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                            {selectedUser?.role === 'Company' ? <Building2 className="w-7 h-7 text-blue-500" /> : <UserIcon className="w-7 h-7 text-emerald-500" />}
                            Profil {selectedUser?.role === 'Company' ? 'Entreprise' : 'Consultant'}
                        </DialogTitle>
                        <DialogDescription>
                            Informations complètes du compte utilisateur #{selectedUser?.id?.slice(0, 8)}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="space-y-8 py-4">
                            {/* Identity Header */}
                            <div className="flex items-start gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                                    <AvatarImage src={selectedUser.photo_profil_url ? `${STORAGE_URL}${selectedUser.photo_profil_url}` : undefined} />
                                    <AvatarFallback className={cn(
                                        "text-2xl font-bold text-white",
                                        selectedUser.role === 'Company' ? "bg-blue-600" : "bg-emerald-600"
                                    )}>
                                        {selectedUser.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2 flex-grow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <h3 className="text-2xl font-bold text-slate-900">{selectedUser.name}</h3>
                                            {selectedUser.role === 'Consultant' && selectedUser.metier && (
                                                <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">{selectedUser.metier}</p>
                                            )}
                                        </div>
                                        <Badge className={cn("border px-3 py-1", getStatusColor(selectedUser.status))}>
                                            {selectedUser.status}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <Mail className="w-4 h-4 text-slate-400" /> {selectedUser.role == "Consultant" ? selectedUser.email_professionnel : selectedUser.email}
                                        </span>
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <Phone className="w-4 h-4 text-slate-400" /> {selectedUser.telephone || selectedUser.phone || "N/A"}
                                        </span>
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <Calendar className="w-4 h-4 text-slate-400" /> Inscrit le {new Date(selectedUser.joined).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Professional Details */}
                                <div className="space-y-6">
                                    {selectedUser.role === 'Company' ? (
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" /> Informations Corporate
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Secteur</p>
                                                    <p className="text-sm font-semibold">{selectedUser.main_sector || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Taille</p>
                                                    <p className="text-sm font-semibold">{selectedUser.company_size || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">SIRET</p>
                                                    <p className="text-sm font-semibold">{selectedUser.siret || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Forme Juridique</p>
                                                    <p className="text-sm font-semibold">{selectedUser.legal_form || "N/A"}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">Contact Responsable</p>
                                                <p className="text-sm font-medium bg-slate-50 p-2 rounded border border-dashed">
                                                    {selectedUser.contact_first_name} {selectedUser.contact_last_name} — <span className="text-slate-500 italic font-normal">{selectedUser.contact_position}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                                <Shield className="w-4 h-4" /> Profil Consultant
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border">
                                                <div className="col-span-2">
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Expertise</p>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            <Badge className="w-fit bg-emerald-500/10 text-emerald-600 border-emerald-200">
                                                                {selectedUser.domaine || "Non spécifié"}
                                                            </Badge>
                                                            {selectedUser.metier && (
                                                                <Badge className="w-fit bg-indigo-500/10 text-indigo-600 border-indigo-200">
                                                                    {selectedUser.metier}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {selectedUser.domaine === 'Autre' && selectedUser.domaine_autre && (
                                                            <p className="text-xs font-medium text-emerald-600 pl-1">{selectedUser.domaine_autre}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Expérience</p>
                                                    <p className="text-sm font-semibold">{selectedUser.experience_totale || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">TJM</p>
                                                    <p className="text-sm font-bold text-emerald-600">{selectedUser.tjm ? `${selectedUser.tjm} Dh/j` : "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Statut Pro</p>
                                                    <p className="text-sm font-semibold">{selectedUser.statut_professionnel || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">IF (Fisc)</p>
                                                    <p className="text-sm font-semibold font-mono">{selectedUser.identifiant_fiscal || "N/A"}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                                    <Settings className="w-4 h-4" /> Outils & Technologies
                                                </h4>
                                                {selectedUser.outils && selectedUser.outils.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        {selectedUser.outils.map((tool: string, idx: number) => (
                                                            <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                                                                {tool}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs italic text-slate-400">Aucun outil renseigné</p>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                                    <Shield className="w-4 h-4" /> Compétences Clés
                                                </h4>
                                                {selectedUser.competences_cles && selectedUser.competences_cles.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        {selectedUser.competences_cles.map((skill: string, idx: number) => (
                                                            <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs italic text-slate-400">Aucune compétence clé renseignée</p>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4" /> Expériences Professionnelles
                                                </h4>
                                                {selectedUser.experiences && selectedUser.experiences.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {selectedUser.experiences.map((exp: any, idx: number) => (
                                                            <div key={idx} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm space-y-2">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h5 className="font-bold text-slate-900">{exp.titre_mission}</h5>
                                                                        <p className="text-xs font-medium text-blue-600">{exp.client} {exp.secteur ? `• ${exp.secteur}` : ''}</p>
                                                                    </div>
                                                                    <Badge variant="outline" className="text-[10px] bg-slate-50">
                                                                        {exp.date_debut ? new Date(exp.date_debut).getFullYear() : ''} - {exp.date_fin ? new Date(exp.date_fin).getFullYear() : 'Présent'}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-xs text-slate-600 line-clamp-3">{exp.description_courte}</p>
                                                                {exp.competences_utilisees && (
                                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                                        {exp.competences_utilisees.split(',').map((s: string, i: number) => (
                                                                            <Badge key={i} variant="secondary" className="text-[9px] px-1.5 py-0 bg-slate-100 text-slate-600 border-none">{s.trim()}</Badge>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs italic text-slate-400">Aucune expérience renseignée</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">Disponibilité</p>
                                                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-sm">
                                                    <p className="font-bold text-emerald-800">{selectedUser.disponibilite_actuelle || "N/A"}</p>
                                                    {selectedUser.charge_disponible && <p className="text-xs text-emerald-600">Charge: {selectedUser.charge_disponible}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Localization & Social */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" /> Localisation
                                        </h4>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                                            <div className="flex items-start gap-2">
                                                <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                                                <div>
                                                    <p className="text-sm font-medium">{selectedUser.address || selectedUser.adresse_complete || "Adresse non renseignée"}</p>
                                                    <p className="text-xs text-slate-500">{selectedUser.city || selectedUser.ville || "Ville"}, {selectedUser.country || selectedUser.pays_residence || "Pays"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                            <Globe className="w-4 h-4" /> Liens & Sociaux
                                        </h4>
                                        <div className="space-y-3">
                                            {selectedUser.linkedin ? (
                                                <a
                                                    href={selectedUser.linkedin}
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
                                                <div className="text-xs italic text-slate-400 p-2">Aucun lien LinkedIn</div>
                                            )}

                                            {selectedUser.site_web && (
                                                <a
                                                    href={selectedUser.site_web}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 bg-white border rounded-xl hover:bg-slate-50 transition-all group"
                                                >
                                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600 group-hover:scale-110 transition-transform">
                                                        <Globe className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700 truncate">{selectedUser.site_web}</span>
                                                </a>
                                            )}

                                            {selectedUser.role === 'Consultant' && (
                                                <Button
                                                    variant="outline"
                                                    className="w-full gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
                                                    onClick={() => selectedUser.cv_url && window.open(selectedUser.cv_url, '_blank')}
                                                    disabled={!selectedUser.cv_url}
                                                >
                                                    <FileText className="w-4 h-4" /> {selectedUser.cv_url ? "Voir le CV" : "CV non disponible"}
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {selectedUser.role === 'Consultant' && (
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                                <FileText className="w-4 h-4" /> Documents
                                            </h4>
                                            {selectedUser.cv_url ? (
                                                <a
                                                    href={`${STORAGE_URL}${selectedUser.cv_url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-500 rounded-lg text-white">
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-blue-900 uppercase">Curriculum Vitae</p>
                                                            <p className="text-[10px] text-blue-600">Cliquez pour visualiser le CV</p>
                                                        </div>
                                                    </div>
                                                    <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-600" />
                                                </a>
                                            ) : (
                                                <p className="text-xs italic text-slate-400">Aucun CV déposé</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Raw Data (Admin Only) */}
                            <Separator />
                            <details className="group">
                                <summary className="text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-600 transition-colors flex items-center gap-2 mb-2">
                                    <div className="w-4 h-4 flex items-center justify-center transition-transform group-open:rotate-90">▶</div>
                                    Données système (JSON)
                                </summary>
                                <div className="p-4 bg-slate-900 rounded-xl overflow-x-auto shadow-inner">
                                    <pre className="text-[10px] text-emerald-400 font-mono">
                                        {JSON.stringify(selectedUser, null, 2)}
                                    </pre>
                                </div>
                            </details>

                            {/* Action Footer */}
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                                    Fermer
                                </Button>
                                <Button
                                    variant={selectedUser.status === 'Active' ? "destructive" : "default"}
                                    className="gap-2"
                                    onClick={() => handleToggleStatus(selectedUser)}
                                >
                                    {selectedUser.status === 'Active' ? (
                                        <>
                                            <Ban className="w-4 h-4" /> Suspendre l'utilisateur
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4" /> Réactiver l'utilisateur
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
