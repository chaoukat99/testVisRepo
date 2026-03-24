import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { MissionPostForm } from "@/components/forms/MissionPostForm";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

import { useLocation } from "react-router-dom";

export default function DashboardPostMission() {
    const { toast } = useToast();
    const location = useLocation();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Reset submission state when any navigation occurs (including clicking the same link)
    useEffect(() => {
        setIsSubmitted(false);
    }, [location.key]);

    const handleSubmit = async (data: any, isDraft: boolean) => {
        setIsLoading(true);
        try {
            const response = await api.publishMission({
                ...data,
                seniorityLevel: data.seniority,
                minExperienceCategory: data.minExperience,
                estimatedDuration: data.duration,
                status: isDraft ? 'Draft' : 'Published'
            });

            if (response.success) {
                if (isDraft) {
                    toast({
                        title: "Brouillon enregistré",
                        description: "Votre mission est sauvegardée dans le dashboard.",
                    });
                } else {
                    setIsSubmitted(true);
                    toast({
                        title: "Mission publiée !",
                        description: "Votre mission est maintenant visible sur la plateforme.",
                    });
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: response.message || "Erreur lors de la publication.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur réseau",
                description: "Impossible de joindre le serveur backend.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
                <GlassCard className="py-12 max-w-lg w-full text-center" hover={false}>
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                        Mission publiée avec succès !
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Notre IA analyse votre mission et recherche les meilleurs consultants.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Button variant="hero" onClick={() => setIsSubmitted(false)} className="w-full">
                            Publier une autre mission
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                            <Link to="/company/missions">Voir mes missions</Link>
                        </Button>
                    </div>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Poster une nouvelle mission</h1>
                <p className="text-muted-foreground">Remplissez le formulaire ci-dessous pour trouver le consultant idéal.</p>
            </div>

            <div className="mt-8">
                <MissionPostForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
