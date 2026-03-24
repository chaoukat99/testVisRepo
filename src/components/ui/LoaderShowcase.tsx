import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { AIMatchingLoader } from "@/components/ui/AIMatchingLoader";
import { SynergyLoader } from "@/components/ui/SynergyLoader";

export function LoaderShowcase() {
    const [activeLoader, setActiveLoader] = useState<string | null>(null);

    const loaders = [
        {
            id: "full",
            name: "Full Screen Loader",
            description: "Main loading screen with rotating rings and orbiting particles",
            component: <LoadingScreen isLoading={true} message="Chargement..." />,
        },
        {
            id: "ai-matching",
            name: "AI Matching Loader",
            description: "Neural network visualization with contextual messages",
            component: (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-lg">
                    <AIMatchingLoader message="Analyse des profils IA..." />
                </div>
            ),
        },
        {
            id: "synergy",
            name: "Synergy Loader",
            description: "Shows connection between consultants and companies",
            component: (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-lg">
                    <SynergyLoader />
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                    Loading Animations
                </h2>
                <p className="text-muted-foreground">
                    Preview different loading states used across the platform
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loaders.map((loader) => (
                    <motion.div
                        key={loader.id}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                    >
                        <GlassCard className="h-full">
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                {loader.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                {loader.description}
                            </p>
                            <Button
                                variant="hero"
                                size="sm"
                                onClick={() => {
                                    setActiveLoader(loader.id);
                                    setTimeout(() => setActiveLoader(null), 3000);
                                }}
                                className="w-full"
                            >
                                Preview (3s)
                            </Button>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* Active Loader Display */}
            {activeLoader && loaders.find((l) => l.id === activeLoader)?.component}

            {/* Usage Examples */}
            <GlassCard>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                    Usage Examples
                </h3>
                <div className="space-y-4 text-sm">
                    <div>
                        <h4 className="font-medium text-foreground mb-2">1. Full Screen Loader</h4>
                        <pre className="bg-secondary/20 p-3 rounded-lg overflow-x-auto">
                            <code>{`<LoadingScreen 
  isLoading={true} 
  message="Chargement..." 
/>`}</code>
                        </pre>
                    </div>

                    <div>
                        <h4 className="font-medium text-foreground mb-2">2. AI Matching Loader</h4>
                        <pre className="bg-secondary/20 p-3 rounded-lg overflow-x-auto">
                            <code>{`<AIMatchingLoader 
  message="Analyse en cours..." 
/>`}</code>
                        </pre>
                    </div>

                    <div>
                        <h4 className="font-medium text-foreground mb-2">3. Synergy Loader</h4>
                        <pre className="bg-secondary/20 p-3 rounded-lg overflow-x-auto">
                            <code>{`<SynergyLoader />`}</code>
                        </pre>
                    </div>

                    <div>
                        <h4 className="font-medium text-foreground mb-2">4. With Page Loading Hook</h4>
                        <pre className="bg-secondary/20 p-3 rounded-lg overflow-x-auto">
                            <code>{`const isLoading = usePageLoading();

<LoadingScreen 
  isLoading={isLoading} 
  message="Chargement de la page..." 
/>`}</code>
                        </pre>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
