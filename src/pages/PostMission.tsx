import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { CircularNavbar } from "@/components/layout/CircularNavbar";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MissionPostForm } from "@/components/forms/MissionPostForm";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function PostMission() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
            description: "Votre mission a été sauvegardée dans la base de données.",
          });
        } else {
          setIsSubmitted(true);
          toast({
            title: "Mission publiée !",
            description: "Votre mission est maintenant enregistrée en base de données.",
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
        description: "Vérifiez que le serveur Node.js est bien lancé sur le port 5000.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="particles-bg" />
        <CircularNavbar />
        <main className="pt-32 pb-24">
          <div className="container px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <GlassCard className="py-12" hover={false}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Mission publiée avec succès !
                </h2>
                <p className="text-muted-foreground mb-8">
                  Notre IA analyse votre mission et recherche les meilleurs consultants. Vous recevrez bientôt des suggestions.
                </p>
                <Button variant="hero" onClick={() => setIsSubmitted(false)}>
                  Publier une autre mission
                </Button>
              </GlassCard>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="particles-bg" />
      <CircularNavbar />
      <main className="pt-32 pb-24">
        <div className="container px-6">
          <SectionHeading
            badge="Publier une mission"
            title="Trouvez le consultant idéal"
            description="Créez une offre de mission détaillée et laissez notre IA vous proposer les meilleurs profils"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12"
          >
            <MissionPostForm onSubmit={handleSubmit} />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
