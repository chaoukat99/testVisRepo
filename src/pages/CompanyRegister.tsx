import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { CircularNavbar } from "@/components/layout/CircularNavbar";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CompanyRegistrationForm } from "@/components/forms/CompanyRegistrationForm";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { OpenInnovationLoader } from "@/components/ui/OpenInnovationLoader";

export default function CompanyRegister() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);


  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await api.registerCompany({
        companyName: data.companyName,
        legalForm: data.legalForm,
        siret: data.siret,
        mainSector: data.mainSector,
        companySize: data.companySize,
        country: data.country,
        city: data.city,
        address: data.address,
        firstName: data.firstName,
        lastName: data.lastName,
        position: data.position,
        email: data.email,
        phone: data.phone,
        password: data.password,
        preferences: {
          contactPreferences: data.contactPreferences,
          missionTypes: data.missionTypes,
          workMode: data.workMode,
          targetZones: data.targetZones
        }
      });

      if (response.success) {
        if (response.token) localStorage.setItem('token', response.token);
        if (response.user) localStorage.setItem('user', JSON.stringify(response.user));
        
        setIsSubmitted(true);
        toast({
          title: "Félicitations !",
          description: "Votre compte est désormais actif. Redirection vers votre dashboard...",
        });
        
        // Auto redirect after a short delay
        setTimeout(() => {
          navigate("/company/dashboard");
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: response.message || "Une erreur est survenue lors de l'inscription.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Impossible de contacter le serveur. Assurez-vous que le backend est lancé.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ... (inside existing isSubmitted logic/effect, trigger loader)

  if (isSubmitted) {
    return <OpenInnovationLoader autoStart={true} successMode={true} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="particles-bg" />
      <CircularNavbar />
      <main className="pt-32 pb-24">
        <div className="container px-6">
          <SectionHeading
            badge="Espace Entreprise"
            title="Inscription Entreprise"
            description="Rejoignez notre réseau d'entreprises innovantes et trouvez les meilleurs consultants"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12"
          >
            <CompanyRegistrationForm onSubmit={handleSubmit} />
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <Link to="/company-login" className="text-primary font-semibold hover:underline">
                Se connecter
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
