
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun } from "lucide-react";

export default function DashboardSettings() {
    return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
                <p className="text-muted-foreground">
                    Gérez vos préférences de compte.
                </p>
            </div>

            <Tabs defaultValue="notifications" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
                    <TabsTrigger
                        value="notifications"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger
                        value="account"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                        Compte & Sécurité
                    </TabsTrigger>
                    <TabsTrigger
                        value="display"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                        Affichage
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="notifications" className="mt-6 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications par email</CardTitle>
                            <CardDescription>
                                Choisissez les emails que vous souhaitez recevoir.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="new-missions" className="flex flex-col space-y-1">
                                    <span>Nouvelles missions</span>
                                    <span className="font-normal text-xs text-muted-foreground">
                                        Recevoir une alerte quand une mission correspond à mon profil.
                                    </span>
                                </Label>
                                <Switch id="new-missions" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="messages" className="flex flex-col space-y-1">
                                    <span>Messages</span>
                                    <span className="font-normal text-xs text-muted-foreground">
                                        Recevoir un email quand je reçois un nouveau message.
                                    </span>
                                </Label>
                                <Switch id="messages" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="marketing" className="flex flex-col space-y-1">
                                    <span>Communications</span>
                                    <span className="font-normal text-xs text-muted-foreground">
                                        Recevoir des news et astuces sur Synergy Hub.
                                    </span>
                                </Label>
                                <Switch id="marketing" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="account" className="mt-6 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sécurité</CardTitle>
                            <CardDescription>
                                Gérez la sécurité de votre compte
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label>Mot de passe</Label>
                                    <p className="text-sm text-muted-foreground">Dernière modification il y a 3 mois</p>
                                </div>
                                <Button variant="outline">Modifier</Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label>Authentification à deux facteurs (2FA)</Label>
                                    <p className="text-sm text-muted-foreground">Ajoutez une couche de sécurité supplémentaire.</p>
                                </div>
                                <Button variant="outline">Activer</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200 dark:border-red-900/50">
                        <CardHeader>
                            <CardTitle className="text-red-500">Zone de danger</CardTitle>
                            <CardDescription>
                                Actions irréversibles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label>Supprimer le compte</Label>
                                    <p className="text-sm text-muted-foreground">Toutes vos données seront effacées.</p>
                                </div>
                                <Button variant="destructive">Supprimer</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="display" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Apparence</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label>Thème</Label>
                                    <p className="text-sm text-muted-foreground">Personnalisez l'apparence de votre dashboard.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Theme switcher is actually handled globally, but for UI representation: */}
                                    <Button variant="outline" size="icon">
                                        <Sun className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Moon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
