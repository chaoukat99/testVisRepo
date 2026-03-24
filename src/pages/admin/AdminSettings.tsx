
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
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export default function AdminSettings() {
    return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Paramètres Globaux</h1>
                    <p className="text-muted-foreground">Configuration de la plateforme Synergy Hub.</p>
                </div>
                <Button>
                    <Save className="mr-2 h-4 w-4" /> Sauvegarder
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Maintenance & Accès</CardTitle>
                        <CardDescription>Gérez l'accessibilité de la plateforme.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="maintenance" className="flex flex-col space-y-1">
                                <span>Mode Maintenance</span>
                                <span className="font-normal text-xs text-muted-foreground">La plateforme sera inaccessible aux utilisateurs non-admin.</span>
                            </Label>
                            <Switch id="maintenance" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="registrations" className="flex flex-col space-y-1">
                                <span>Inscriptions Ouvertes</span>
                                <span className="font-normal text-xs text-muted-foreground">Autoriser de nouveaux consultants et entreprises à s'inscrire.</span>
                            </Label>
                            <Switch id="registrations" defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>IA & Matching</CardTitle>
                        <CardDescription>Configuration du moteur de matching.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Seuil de recommandation (%)</Label>
                            <div className="flex gap-4">
                                <Input type="number" defaultValue="75" className="max-w-[100px]" />
                                <p className="text-sm text-muted-foreground flex items-center">Score minimum pour suggérer un profil.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
