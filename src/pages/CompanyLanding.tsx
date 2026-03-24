import { CircularNavbar } from "@/components/layout/CircularNavbar";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CTASection } from "@/components/home/CTASection";

const CompanyLanding = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO title="OpenIn Partners - Solutions Entreprises" />
            <div className="particles-bg" />
            <CircularNavbar />
            <main className="pt-0">
                <FeaturesSection type="company" maxItems={5} />
                {/* <CTASection type="company" /> */}
            </main>
            <Footer />
        </div>
    );
};

export default CompanyLanding;
