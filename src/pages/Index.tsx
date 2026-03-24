import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CircularNavbar } from "@/components/layout/CircularNavbar";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CTASection } from "@/components/home/CTASection";
import { GSAPShowcase } from "@/components/home/GSAPShowcase";
import { SynergyDNASection } from "@/components/home/SynergyDNASection";
import { VideoIntro } from "@/components/ui/VideoIntro";
import { useOnboardingStore } from "@/store/useOnboardingStore";

const Index = () => {
  const { setIntroActive } = useOnboardingStore();

  // Show intro only once per session
  const [showIntro, setShowIntro] = useState(() => {
    const active = !sessionStorage.getItem("videoIntroSeen");
    return active;
  });
  const [introComplete, setIntroComplete] = useState(!showIntro);

  useEffect(() => {
    setIntroActive(showIntro);
  }, [showIntro, setIntroActive]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setIntroComplete(true);
    setIntroActive(false);
  };

  useEffect(() => {
    // Clear the skip flag so subsequent visits (e.g. reload) show the loader again
    sessionStorage.removeItem('skipIntro');
  }, []);

  return (
    <>
      {/* Video Intro Overlay — only on first visit per session */}
      {showIntro && <VideoIntro onComplete={handleIntroComplete} />}

      {/* Main page content — fades in after intro */}
      <motion.div
        className="min-h-screen bg-background"
        initial={{ opacity: showIntro ? 0 : 1 }}
        animate={{ opacity: introComplete ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <SEO />
        <div className="particles-bg" />
        <CircularNavbar />
        <main>
          <HeroSection />

          <GSAPShowcase />
          <SynergyDNASection />
          <FeaturesSection type="company" showDescription={false} showBadge={false} />
          <HowItWorksSection />
          {/* <NetworkingSection /> */}
          {/* <AntigravitySection /> */}
          {/* <CTASection /> */}
        </main>
        <Footer />
      </motion.div>
    </>
  );
};

export default Index;
