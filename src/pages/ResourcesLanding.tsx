
import { CircularNavbar } from "@/components/layout/CircularNavbar";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/layout/Footer";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";

const ResourcesLanding = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO title="OpenIn Partners - Ressources" />
            <div className="particles-bg" />
            <CircularNavbar />
            <main className="pt-0">
                <FeaturesSection type="resources" />
                <CTASection type="consultant" />
            </main>
            <Footer />
        </div>
    );
};

export default ResourcesLanding;
