
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
import { Shield, CreditCard, Users } from "lucide-react";

export default function CompanyDashboardSettings() {
    return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
                <p className="text-muted-foreground">
                    Gérez les paramètres de votre compte entreprise.
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
                        value="billing"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                        Facturation
                    </TabsTrigger>
                    <TabsTrigger
                        value="team"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                        Équipe
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="notifications" className="mt-6 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Alertes Recrutement</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="new-candidates" className="flex flex-col space-y-1">
                                    <span>Nouvelles Candidatures</span>
                                    <span className="font-normal text-xs text-muted-foreground">
                                        Recevoir un email à chaque nouvelle candidature.
                                    </span>
                                </Label>
                                <Switch id="new-candidates" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="daily-digest" className="flex flex-col space-y-1">
                                    <span>Résumé Quotidien</span>
                                    <span className="font-normal text-xs text-muted-foreground">
                                        Recevoir un récapitulatif des activités chaque matin.
                                    </span>
                                </Label>
                                <Switch id="daily-digest" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="billing" className="mt-6 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" /> Méthode de paiement
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center font-bold text-xs text-gray-500">VISA</div>
                                    <div>
                                        <p className="font-medium">•••• •••• •••• 4242</p>
                                        <p className="text-xs text-muted-foreground">Expire le 12/2025</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Modifier</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="team" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" /> Gestion de l'équipe
                            </CardTitle>
                            <CardDescription>Invitez vos collaborateurs à gérer les recrutements.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">JD</div>
                                    <div>
                                        <p className="font-medium text-sm">Jean Dupont (Vous)</p>
                                        <p className="text-xs text-muted-foreground">Administrateur</p>
                                    </div>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full mt-4">Inviter un membre</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
