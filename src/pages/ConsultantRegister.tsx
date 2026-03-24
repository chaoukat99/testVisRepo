import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { CircularNavbar } from "@/components/layout/CircularNavbar";
import { Footer } from "@/components/layout/Footer";
import { ConsultantRegistrationForm } from "@/components/forms/ConsultantRegistrationForm";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function ConsultantRegister() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    if (isSubmitted && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isSubmitted && countdown === 0) {
      window.location.href = "/";
    }
  }, [isSubmitted, countdown]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('profile_type', data.profile_type || 'Consultant');
      formData.append('prenom', data.prenom);
      formData.append('nom', data.nom);
      formData.append('email_professionnel', data.email_professionnel);
      formData.append('telephone', data.telephone);
      formData.append('mot_de_passe', data.mot_de_passe);

      // Handle profile data (excluding files and passwords)
      const profileData = { ...data };
      delete profileData.mot_de_passe;
      delete profileData.confirm_password;
      delete profileData.photo_profil;
      delete profileData.cv;
      delete profileData.profile_type;

      formData.append('profile_data', JSON.stringify(profileData));

      // Append files if they exist
      if (data.photo_profil && data.photo_profil.length > 0) {
        formData.append('photo_profil', data.photo_profil[0]);
      }
      if (data.cv && data.cv.length > 0) {
        formData.append('cv', data.cv[0]);
      }

      const response = await api.registerConsultant(formData);

      if (response.success) {
        if (response.token) localStorage.setItem('token', response.token);
        if (response.user) localStorage.setItem('user', JSON.stringify(response.user));
        setIsSubmitted(true);
        toast({
          title: "Félicitations !",
          description: "Votre profil est maintenant actif. Bienvenue sur OpenIN Partners !",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: response.message || "Erreur lors de l'inscription.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur réseau",
        description: "Impossible de joindre le serveur.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <CircularNavbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-4"
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </motion.div>

            <h2 className="text-2xl font-bold text-foreground mb-3">
              Inscription Réussie !
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Votre profil est désormais <strong>actif</strong>. Vous avez maintenant
              accès à toutes les opportunités de la plateforme sans attendre.
            </p>

            <div className="bg-secondary/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Vous recevrez un email de confirmation à l'adresse :
              </p>
              <p className="font-semibold text-foreground mt-1">
                {/* Email will be shown here if needed */}
                Vérifiez votre boîte de réception
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => window.location.href = "/consultant/dashboard"}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Accéder à mon Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-muted-foreground">
                Redirection automatique dans {countdown} seconde{countdown !== 1 ? 's' : ''}...
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <CircularNavbar />
      <main className="pt-32 pb-24">
        <div className="container px-6">
          {/* AI Mode Banner */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-purple-600/10 border border-violet-500/20 rounded-2xl px-6 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-foreground font-semibold text-sm">✨ Essayez le mode IA</p>
                  <p className="text-muted-foreground text-xs">Laissez notre IA vous guider question par question</p>
                </div>
              </div>
              <Link
                to="/consultant-register-ai"
                className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20 whitespace-nowrap"
              >
                Essayer le mode IA
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <ConsultantRegistrationForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link to="/consultant-login" className="text-primary font-semibold hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
