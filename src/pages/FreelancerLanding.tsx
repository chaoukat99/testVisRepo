import { CircularNavbar } from "@/components/layout/CircularNavbar";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CTASection } from "@/components/home/CTASection";

const FreelancerLanding = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO title="OpenIn Partners - Espace Freelance" />
            <div className="particles-bg" />
            <CircularNavbar />
            <main className="pt-0">
                <FeaturesSection type="freelancer" maxItems={5} />
                <CTASection type="freelancer" />
            </main>
            <Footer />
        </div>
    );
};

export default FreelancerLanding;
