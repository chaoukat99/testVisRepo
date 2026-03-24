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
import { ConsultantProfileDialog } from "@/components/admin/ConsultantProfileDialog";
import { Separator } from "@/components/ui/separator";
import {
    Search,
    MoreHorizontal,
    Shield,
    Ban,
    CheckCircle,
    User as UserIcon,
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

export default function AdminConsultants() {
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
                // Filter only Consultants
                const consultants = response.users.filter((u: any) => u.role === 'Consultant');
                setUsers(consultants);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les consultants.",
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
                    title: "Consultant supprimé",
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
                    <h1 className="text-3xl font-bold tracking-tight">Gestion des Consultants</h1>
                    <p className="text-muted-foreground">Administrez les profils consultants inscrits sur la plateforme.</p>
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
                            <CardTitle className="text-xl font-bold">Base Consultants</CardTitle>
                            <CardDescription>Visualisez et gérez les {users.length} consultants inscrits.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom, métier ou compétence..."
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
                                    <TableHead className="font-bold">Consultant</TableHead>
                                    <TableHead className="font-bold">Expertise</TableHead>
                                    <TableHead className="font-bold">Statut</TableHead>
                                    <TableHead className="font-bold">Date d'inscription</TableHead>
                                    <TableHead className="text-right font-bold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Chargement des consultants...</TableCell>
                                    </TableRow>
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Aucun consultant trouvé.</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-muted/20 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                                        <AvatarImage src={user.photo_profil_url ? `${STORAGE_URL}${user.photo_profil_url}` : undefined} />
                                                        <AvatarFallback className="text-white font-bold bg-emerald-500">
                                                            {user.name?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm">{user.name}</span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Mail className="w-3 h-3" /> {user.email_professionnel}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {user.profile_type && (
                                                        <Badge className="w-fit text-[9px] px-1.5 py-0 h-4 bg-purple-500/10 text-purple-600 border-purple-200 font-bold">
                                                            {user.profile_type}
                                                        </Badge>
                                                    )}
                                                    {user.metier && (
                                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-tight">
                                                            {user.metier}
                                                        </span>
                                                    )}
                                                    {(user.competences_cles?.length > 0 || user.outils?.length > 0) && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {[...(user.competences_cles || []), ...(user.outils || [])].slice(0, 3).map((tag: any, i: number) => (
                                                                <Badge key={i} variant="outline" className="text-[8px] px-1 py-0 h-3 bg-muted/30 border-transparent">{tag}</Badge>
                                                            ))}
                                                        </div>
                                                    )}
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

            {/* Consultant Profile Dialog */}
            <ConsultantProfileDialog
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                user={selectedUser}
                onToggleStatus={handleToggleStatus}
            />
        </div>
    );
}
