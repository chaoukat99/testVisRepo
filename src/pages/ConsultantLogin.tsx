
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Lock, Mail, ArrowRight, Loader2, Sparkles, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { CircularNavbar } from "@/components/layout/CircularNavbar";
import { Footer } from "@/components/layout/Footer";

export default function ConsultantLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.login({
                email,
                password,
                role: 'consultant'
            });

            if (response.success && response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                toast({
                    title: "Connexion réussie",
                    description: "Heureux de vous revoir !",
                });

                navigate("/consultant/dashboard");
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: response.message || "Identifiants invalides.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de se connecter au serveur.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <CircularNavbar />

            <main className="flex-grow flex items-center justify-center p-4 pt-32 pb-24 relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="flex flex-col items-center mb-8 gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 relative group">
                            <motion.div
                                className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <UserCircle className="w-8 h-8 relative z-10" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Espace Consultant</h1>
                            <p className="text-muted-foreground mt-2">Accédez à vos missions et gérez votre profil expert</p>
                        </div>
                    </div>

                    <Card className="border-border/50 shadow-2xl backdrop-blur-md bg-card/50 border-t-emerald-500/20">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-emerald-500" />
                                Connexion
                            </CardTitle>
                            <CardDescription>
                                Entrez vos identifiants pour accéder à votre tableau de bord.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleLogin}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            placeholder="nom@exemple.com"
                                            className="pl-10 bg-background/50 border-border/50 focus:border-emerald-500/50 transition-all"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium leading-none">
                                            Mot de passe
                                        </label>
                                        <Link to="#" className="text-xs text-emerald-600 hover:underline">
                                            Mot de passe oublié ?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 bg-background/50 border-border/50 focus:border-emerald-500/50 transition-all"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 group h-11"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Connexion en cours...
                                        </>
                                    ) : (
                                        <>
                                            Se connecter
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </Button>
                                <div className="text-center text-sm text-muted-foreground">
                                    Pas encore de compte ?{" "}
                                    <Link to="/consultant-register" className="text-emerald-600 font-semibold hover:underline">
                                        Devenir consultant
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>

                    <p className="text-center mt-8 text-xs text-muted-foreground px-4">
                        Rejoignez la plus grande communauté de consultants experts et trouvez votre prochaine mission.
                    </p>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
