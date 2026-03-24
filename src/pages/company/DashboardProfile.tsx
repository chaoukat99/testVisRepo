import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Save, MapPin, Globe, Loader2, Shield, Phone, User, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function CompanyDashboardProfile() {
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.getMe();
                if (response.success && response.user) {
                    setProfile(response.user);
                } else {
                    toast({
                        variant: "destructive",
                        title: "Erreur",
                        description: "Impossible de charger votre profil."
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profile) return null;

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const response = await api.updateProfile(profile);
            if (response.success) {
                toast({
                    title: "Succès",
                    description: "Profil entreprise mis à jour."
                });

                // Update local storage name if it changed
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                user.name = profile.company_name;
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: response.message || "Impossible de mettre à jour le profil."
                });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors de la sauvegarde."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profil Entreprise</h1>
                    <p className="text-muted-foreground">
                        Gérez les informations publiques et administratives de votre entreprise.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={isLoading} className="shadow-lg shadow-primary/20">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Enregistrer les modifications
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-[280px_1fr]">
                <div className="space-y-6">
                    <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Identité Visuelle</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <Avatar className="h-32 w-32 border-4 border-white shadow-2xl rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                                    <AvatarImage src="/placeholder-company.jpg" />
                                    <AvatarFallback className="text-5xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl text-center font-black">
                                        {profile.company_name?.charAt(0) || "C"}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-lg">{profile.company_name}</h3>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">{profile.main_sector}</p>
                            </div>
                            <Button variant="outline" size="sm" className="w-full text-xs font-bold uppercase tracking-widest border-dashed">
                                Changer le logo
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Statistiques Rapides</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-[10px] font-bold text-blue-400 uppercase">Status</p>
                                <p className="text-sm font-bold text-blue-700">{profile.status || "Actif"}</p>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                <p className="text-[10px] font-bold text-indigo-400 uppercase">Inscrit le</p>
                                <p className="text-sm font-bold text-indigo-700">{new Date(profile.created_at).toLocaleDateString('fr-FR')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-xl">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle>Informations Corporate</CardTitle>
                                    <CardDescription>Détails légaux et sectoriels de votre structure.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName" className="font-bold text-xs uppercase text-muted-foreground">Nom Officiel</Label>
                                    <Input
                                        id="companyName"
                                        placeholder="Ex: Acme Corp"
                                        value={profile.company_name || ""}
                                        onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="legalForm" className="font-bold text-xs uppercase text-muted-foreground">Forme Juridique</Label>
                                    <Input
                                        id="legalForm"
                                        placeholder="Ex: SA, SARL"
                                        value={profile.legal_form || ""}
                                        onChange={(e) => setProfile({ ...profile, legal_form: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="siret" className="font-bold text-xs uppercase text-muted-foreground">N° SIRET / ICE</Label>
                                    <Input
                                        id="siret"
                                        placeholder="Identification fiscale"
                                        value={profile.siret || ""}
                                        onChange={(e) => setProfile({ ...profile, siret: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="industry" className="font-bold text-xs uppercase text-muted-foreground">Secteur d'activité</Label>
                                    <Input
                                        id="industry"
                                        placeholder="Ex: Technologie, Santé"
                                        value={profile.main_sector || ""}
                                        onChange={(e) => setProfile({ ...profile, main_sector: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="size" className="font-bold text-xs uppercase text-muted-foreground">Taille de l'entreprise</Label>
                                    <Input
                                        id="size"
                                        placeholder="Ex: 50-200 employés"
                                        value={profile.company_size || ""}
                                        onChange={(e) => setProfile({ ...profile, company_size: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle>Contact Principal</CardTitle>
                                    <CardDescription>La personne responsable du compte sur la plateforme.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="font-bold text-xs uppercase text-muted-foreground">Prénom</Label>
                                    <Input
                                        id="firstName"
                                        value={profile.contact_first_name || ""}
                                        onChange={(e) => setProfile({ ...profile, contact_first_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="font-bold text-xs uppercase text-muted-foreground">Nom</Label>
                                    <Input
                                        id="lastName"
                                        value={profile.contact_last_name || ""}
                                        onChange={(e) => setProfile({ ...profile, contact_last_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position" className="font-bold text-xs uppercase text-muted-foreground">Fonction</Label>
                                    <Input
                                        id="position"
                                        placeholder="Ex: DRH, CEO"
                                        value={profile.contact_position || ""}
                                        onChange={(e) => setProfile({ ...profile, contact_position: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="font-bold text-xs uppercase text-muted-foreground">Téléphone direct</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            className="pl-9"
                                            value={profile.phone || ""}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle>Siège Social & Web</CardTitle>
                                    <CardDescription>Localisation et liens digitaux.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 border-t pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="font-bold text-xs uppercase text-muted-foreground">Adresse complète</Label>
                                    <Textarea
                                        placeholder="N°, Rue, Quartier..."
                                        value={profile.address || ""}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        className="min-h-[60px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs uppercase text-muted-foreground">Ville</Label>
                                    <Input
                                        value={profile.city || ""}
                                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs uppercase text-muted-foreground">Pays</Label>
                                    <Input
                                        value={profile.country || ""}
                                        onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="font-bold text-xs uppercase text-muted-foreground">Site Web Officiel</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9"
                                            placeholder="https://www.votre-entreprise.com"
                                            value={profile.website || ""}
                                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
