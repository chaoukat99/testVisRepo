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
    Building2,
    Mail,
    Phone,
    MapPin,
    Activity,
    Briefcase,
    Calendar,
    Globe,
    Linkedin,
    Trash2,
    Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useEffect, useState } from "react";
import { api, STORAGE_URL } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function AdminCompanies() {
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
                // Filter only Companies
                const companies = response.users.filter((u: any) => u.role === 'Company');
                setUsers(companies);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les entreprises.",
                variant: "destructive",
            });
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
                    title: "Entreprise supprimée",
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
        user.main_sector?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.siret?.includes(searchQuery)
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            case 'Suspended': return 'bg-red-500/10 text-red-600 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestion des Entreprises</h1>
                    <p className="text-muted-foreground">Administrez les comptes entreprises présents sur la plateforme.</p>
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
                            <CardTitle className="text-xl font-bold">Base Entreprises</CardTitle>
                            <CardDescription>Visualisez et gérez les {users.length} entreprises inscrites.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom, email ou secteur..."
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
                                    <TableHead className="font-bold">Entreprise</TableHead>
                                    <TableHead className="font-bold">Secteur & Taille</TableHead>
                                    <TableHead className="font-bold">Statut</TableHead>
                                    <TableHead className="font-bold">Date d'inscription</TableHead>
                                    <TableHead className="text-right font-bold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Chargement des entreprises...</TableCell>
                                    </TableRow>
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Aucune entreprise trouvée.</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-muted/20 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                                        <AvatarImage src={user.photo_profil_url ? `${STORAGE_URL}${user.photo_profil_url}` : undefined} />
                                                        <AvatarFallback className="text-white font-bold bg-blue-500">
                                                            {user.name?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm">{user.name}</span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Mail className="w-3 h-3" /> {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{user.main_sector || "Secteur N/A"}</span>
                                                    <span className="text-xs text-muted-foreground">{user.company_size || "Taille N/A"}</span>
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

            {/* User Details Modal - Reduced for Company Specifics */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                            <Building2 className="w-7 h-7 text-blue-500" />
                            Profil Entreprise
                        </DialogTitle>
                        <DialogDescription>
                            Informations complètes du compte entreprise #{selectedUser?.id?.slice(0, 8)}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="space-y-8 py-4">
                            {/* Identity Header */}
                            <div className="flex items-start gap-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                                    <AvatarImage src={selectedUser.photo_profil_url ? `${STORAGE_URL}${selectedUser.photo_profil_url}` : undefined} />
                                    <AvatarFallback className="text-2xl font-bold text-white bg-blue-600">
                                        {selectedUser.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2 flex-grow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <h3 className="text-2xl font-bold text-blue-950">{selectedUser.name}</h3>
                                            <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">{selectedUser.main_sector}</p>
                                        </div>
                                        <Badge className={cn("border px-3 py-1", getStatusColor(selectedUser.status))}>
                                            {selectedUser.status}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <Mail className="w-4 h-4 text-blue-500" /> {selectedUser.email}
                                        </span>
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <Phone className="w-4 h-4 text-blue-500" /> {selectedUser.telephone || selectedUser.phone || "N/A"}
                                        </span>
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <Calendar className="w-4 h-4 text-blue-500" /> Inscrit le {new Date(selectedUser.joined).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Corporate Details */}
                                <div className="space-y-6">
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
                                                    <p className="text-sm font-medium">{selectedUser.address || "Adresse non renseignée"}</p>
                                                    <p className="text-xs text-slate-500">{selectedUser.city || "Ville"}, {selectedUser.country || "Pays"}</p>
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
                                                    <span className="text-sm font-medium text-slate-700">Page LinkedIn</span>
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
                                        </div>
                                    </div>
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
                                    <pre className="text-[10px] text-blue-400 font-mono">
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
                                            <Ban className="w-4 h-4" /> Suspendre
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4" /> Réactiver
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
