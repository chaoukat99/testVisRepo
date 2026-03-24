
import { useState } from "react";
import { Search, BookOpen, Plus, Filter, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data
const RESOURCES = [
    {
        id: "1",
        title: "L'Avenir de l'IA Générative",
        description: "Une analyse approfondie des tendances et impacts de l'IA générative sur les entreprises en 2026.",
        category: "AI",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
        pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
        id: "2",
        title: "Stratégies Business & Innovation",
        description: "Comment aligner stratégie d'entreprise et innovation technologique pour une croissance durable.",
        category: "Business",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
        id: "3",
        title: "Architecture Cloud Moderne",
        description: "Guide complet sur les architectures cloud-native, microservices et serverless.",
        category: "IT",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
        id: "4",
        title: "Politiques Publiques & Numérique",
        description: "Comprendre les enjeux de la régulation numérique et des politiques publiques actuelles.",
        category: "Politique",
        imageUrl: "https://images.unsplash.com/photo-1541872703-74c59636a226?auto=format&fit=crop&q=80&w=800",
        pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
        id: "5",
        title: "Machine Learning Ops (MLOps)",
        description: "Best practices pour le déploiement et la maintenance de modèles ML en production.",
        category: "AI",
        imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800",
        pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    },
    {
        id: "6",
        title: "Leadership à l'Ère Digitale",
        description: "Développer les compétences de leadership nécessaires pour naviguer dans un monde en constante évolution.",
        category: "Business",
        imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
        pdfUrl: "https://pdfobject.com/pdf/sample.pdf",
    }
];

const CATEGORIES = ["Tout", "AI", "Business", "IT", "Politique"];

export function Bibliotheque() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tout");

    const filteredResources = RESOURCES.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "Tout" || resource.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
            <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tight">Bibliothèque Numérique</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Accédez à notre collection exclusive de livres blancs, guides et rapports.
                </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
                <div className="relative w-full max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Rechercher un document..."
                        className="pl-12 h-12 text-lg rounded-full bg-white text-black border-2 border-primary/10 focus:border-primary/50 transition-all shadow-lg shadow-primary/5"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    {CATEGORIES.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? "hero" : "outline"}
                            onClick={() => setSelectedCategory(category)}
                            className="rounded-full px-6"
                            size="sm"
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
                <AnimatePresence>
                    {filteredResources.map((resource) => (
                        <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            layout
                        >
                            <GlassCard hover={true} className="h-full flex flex-col overflow-hidden group border-0 ring-1 ring-white/10">
                                <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                                    <img
                                        src={resource.imageUrl}
                                        alt={resource.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <Badge className="absolute bottom-3 left-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-0">
                                        {resource.category}
                                    </Badge>
                                </div>
                                <div className="p-6 flex flex-col flex-1 gap-4">
                                    <div className="flex-1 space-y-2">
                                        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                                            {resource.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {resource.description}
                                        </p>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            className="flex-1 gap-2"
                                            variant="outline"
                                            onClick={() => window.open(resource.pdfUrl, '_blank')}
                                        >
                                            <BookOpen className="h-4 w-4" /> Lire
                                        </Button>
                                        <Button className="flex-1 gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                                            <Plus className="h-4 w-4" /> Ajouter
                                        </Button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredResources.length === 0 && (
                    <div className="col-span-full text-center py-20">
                        <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">Aucun document trouvé.</p>
                        <Button
                            variant="link"
                            onClick={() => { setSearchQuery(""); setSelectedCategory("Tout") }}
                            className="mt-2 text-primary"
                        >
                            Réinitialiser la recherche
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
