
import { CircularNavbar } from "@/components/layout/CircularNavbar";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/layout/Footer";
import { Bibliotheque } from "@/components/resources/Bibliotheque";

const BibliothequePage = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO title="OpenIn Partners - Bibliothèque" />
            <div className="particles-bg" />
            <CircularNavbar />
            <main className="pt-24 pb-16">
                <Bibliotheque />
            </main>
            <Footer />
        </div>
    );
};

export default BibliothequePage;
