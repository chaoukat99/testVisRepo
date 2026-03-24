import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api, STORAGE_URL } from "@/lib/api";
import { Loader2, Camera, Save } from "lucide-react";
import { TagsInput } from "@/components/forms/TagsInput";

export default function DashboardProfile() {
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

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const response = await api.updateProfile(profile);
            if (response.success) {
                toast({
                    title: "Succès",
                    description: "Votre profil a été mis à jour."
                });

                // Update local storage name if it changed
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                user.name = `${profile.prenom} ${profile.nom}`;
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
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
                    <p className="text-muted-foreground">
                        Gérez vos informations personnelles et professionnelles.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Enregistrer les modifications
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-[250px_1fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Photo de profil</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                                <AvatarImage src={profile.photo_profil_url ? `${STORAGE_URL}${profile.photo_profil_url}` : ""} />
                                <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                                    {getInitials(profile.prenom, profile.nom)}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="absolute bottom-0 right-0 rounded-full shadow-lg"
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="font-medium">{profile.prenom} {profile.nom}</h3>
                            <p className="text-xs text-muted-foreground">{profile.metier || 'Consultant'}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations Personnelles</CardTitle>
                            <CardDescription>
                                Ces informations seront visibles par les entreprises.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <Input
                                        id="firstName"
                                        value={profile.prenom || ""}
                                        onChange={(e) => setProfile({ ...profile, prenom: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input
                                        id="lastName"
                                        value={profile.nom || ""}
                                        onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Titre Professionnel</Label>
                                <Input
                                    id="title"
                                    value={profile.metier || ""}
                                    placeholder="ex: Développeur Full Stack React / Node.js"
                                    onChange={(e) => setProfile({ ...profile, metier: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    className="min-h-[100px]"
                                    value={profile.bio || ""}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email professionnel</Label>
                                    <Input id="email" type="email" value={profile.email_professionnel || ""} readOnly className="bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={profile.telephone || ""}
                                        onChange={(e) => setProfile({ ...profile, telephone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Expertise & Tarifs</CardTitle>
                            <CardDescription>Détaillez vos compétences et vos outils préférés.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <TagsInput
                                    label="Compétences clés"
                                    tags={profile.competences_cles || []}
                                    onTagsChange={(newTags) => setProfile({ ...profile, competences_cles: newTags })}
                                    placeholder="Ajouter une compétence (ex: React, Project Management...)"
                                    suggestions={["React", "Node.js", "TypeScript", "Python", "Docker", "AWS", "Agile", "DevOps"]}
                                />
                                <TagsInput
                                    label="Outils maîtrisés"
                                    tags={profile.outils || []}
                                    onTagsChange={(newTags) => setProfile({ ...profile, outils: newTags })}
                                    placeholder="Ajouter un outil (ex: Jira, Figma, GitHub...)"
                                    suggestions={["Jira", "Figma", "VS Code", "GitHub", "Slack", "Postman", "Trello", "Notion"]}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label>Domaine d'expertise</Label>
                                    <Input
                                        value={profile.domaine || ""}
                                        onChange={(e) => setProfile({ ...profile, domaine: e.target.value })}
                                        placeholder="ex: IT / Digital"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tjm">TJM (Tarif Journalier Moyen)</Label>
                                    <div className="relative">
                                        <Input
                                            id="tjm"
                                            type="number"
                                            value={profile.tjm || ""}
                                            onChange={(e) => setProfile({ ...profile, tjm: e.target.value })}
                                            className="pl-8"
                                        />
                                        <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">€</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="availability">Disponibilité</Label>
                                    <Select
                                        value={profile.disponibilite_actuelle || "immediate"}
                                        onValueChange={(val) => setProfile({ ...profile, disponibilite_actuelle: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="immediate">Immédiate</SelectItem>
                                            <SelectItem value="1month">Dans 1 mois</SelectItem>
                                            <SelectItem value="3months">Dans 3 mois</SelectItem>
                                            <SelectItem value="closed">Non disponible</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Expériences Professionnelles</CardTitle>
                            <CardDescription>Présentez vos missions passées et vos réalisations.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {profile.experiences && profile.experiences.length > 0 ? (
                                <div className="space-y-4">
                                    {profile.experiences.map((exp: any, idx: number) => (
                                        <div key={idx} className="p-4 rounded-lg border bg-muted/30 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-slate-900">{exp.titre_mission}</h4>
                                                    <p className="text-sm font-medium text-primary flex items-center gap-2">
                                                        {exp.client} {exp.secteur && <span className="text-muted-foreground">• {exp.secteur}</span>}
                                                    </p>
                                                </div>
                                                <div className="text-xs text-muted-foreground font-medium bg-white px-2 py-1 rounded border">
                                                    {exp.date_debut ? new Date(exp.date_debut).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : ''} -
                                                    {exp.date_fin ? new Date(exp.date_fin).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : 'Présent'}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{exp.description_courte}</p>
                                            {exp.competences_utilisees && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {exp.competences_utilisees.split(',').map((s: string, i: number) => (
                                                        <Badge key={i} variant="secondary" className="text-[10px] bg-slate-200/50 text-slate-700 border-none">{s.trim()}</Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed rounded-xl">
                                    <p className="text-sm text-muted-foreground">Aucune expérience ajoutée pour le moment.</p>
                                </div>
                            )}
                            <Button variant="outline" className="w-full border-dashed" disabled>
                                + Ajouter une expérience (Prochainement)
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
}
