import { CircularNavbar } from "@/components/layout/CircularNavbar";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CTASection } from "@/components/home/CTASection";

const ConsultantLanding = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO title="OpenIn Partners - Espace Consultants" />
            <div className="particles-bg" />
            <CircularNavbar />
            <main className="pt-0">
                <FeaturesSection type="consultant" maxItems={5} />
            </main>
            <Footer />
        </div>
    );
};

export default ConsultantLanding;
