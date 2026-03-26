import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Users, Rocket, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { SectionGlow } from "@/components/ui/SectionGlow";

interface HeroSectionProps {
  type?: "company" | "consultant" | "freelancer";
  topTitle?: string;
  badgeText?: string;
}

const Typewriter = ({ text, delay = 0, speed = 100, showCursor = true }: { text: string; delay?: number; speed?: number; showCursor?: boolean }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let index = 0;

    const type = () => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
        timeout = setTimeout(type, speed);
      } else {
        setComplete(true);
      }
    };

    const startTimeout = setTimeout(type, delay);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeout);
    };
  }, [text, delay, speed]);

  return (
    <span className="inline-flex items-center">
      {displayedText}
      {showCursor && !complete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="ml-1 w-2 md:w-4 h-8 md:h-12 bg-primary inline-block self-center"
        />
      )}
    </span>
  );
};

export function HeroSection({ type, topTitle, badgeText }: HeroSectionProps) {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    },
  };

  const renderButtons = () => {
    if (type === "company") {
      return (
        <>
          <Button
            asChild
            className="h-16 px-10 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 font-bold group"
          >
            <Link to="/company-register" className="flex items-center gap-3">
              <Building2 className="w-5 h-5" />
              {t('cta.btn_start')} {/* Start for Free */}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-16 px-10 rounded-full border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 transition-all duration-300 font-bold"
          >
            <Link to="/company-login" className="flex items-center gap-3">
              <LogIn className="w-5 h-5" />
              {t('navbar.login')}
            </Link>
          </Button>
        </>
      );
    }

    if (type === "consultant" || type === "freelancer") {
      return (
        <>
          <Button
            asChild
            className="h-16 px-10 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 font-bold group"
          >
            <Link to="/consultant-register" className="flex items-center gap-3">
              <Rocket className="w-5 h-5" />
              {t('cta.btn_start')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-16 px-10 rounded-full border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 transition-all duration-300 font-bold"
          >
            <Link to="/consultant-login" className="flex items-center gap-3">
              <LogIn className="w-5 h-5" />
              {t('navbar.login')}
            </Link>
          </Button>
        </>
      );
    }

    // Default (Home)
    return (
      <>
        <Button
          asChild
          className="h-16 px-10 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 font-bold group"
        >
          <Link to="/company-solutions" className="flex items-center gap-3">
            <Building2 className="w-5 h-5" />
            {t('hero.btn_company')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-16 px-10 rounded-full border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 transition-all duration-300 font-bold"
        >
          <Link to="/consultant-opportunities" className="flex items-center gap-3">
            <Users className="w-5 h-5" />
            {t('hero.btn_consultant')}
          </Link>
        </Button>
      </>
    );
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020617]">
      <SectionGlow opacity={0.25} />

      {/* Grid Pattern with Fade */}
      <div className="absolute inset-0 grid-pattern opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container relative z-20 px-6 flex flex-col items-center text-center space-y-8 pt-20"
      >
        {/* Badge */}


        {/* Title */}
        <motion.h1
          variants={titleVariants}
          className="max-w-5xl text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white"
          style={{ fontSize: "60px" }}
        >
          <div className="flex flex-col items-center justify-center gap-2 md:gap-4">
            <span className="opacity-90">
              <Typewriter text={t('hero.title_prefix')} delay={500} />
            </span>
            <span
              className="relative inline-flex items-center bg-gradient-to-r from-primary via-indigo-400 to-accent bg-clip-text text-transparent"
            >
              <Typewriter text={t('hero.words.excellence')} delay={2500} showCursor={false} />
            </span>
          </div>
        </motion.h1>
        <motion.div variants={itemVariants} className="relative inline-flex group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50 blur-lg opacity-20 transition-opacity duration-500 group-hover:opacity-40" />
          <span className="relative px-8 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm sm:text-base font-medium tracking-[0.2em] uppercase text-white/70 flex items-center gap-4" style={{ color: "#85c932" }}>
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            {badgeText || t('hero.badge')}
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </span>
        </motion.div>
        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="max-w-4xl text-lg md:text-xl text-white/50 leading-relaxed font-light tracking-wide mx-auto"
        >
          {t('hero.subtitle')} {t('hero.subtitle_highlight')}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 pt-4"
        >

        </motion.div>

        {/* Scroll Indicator — mouse icon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="pt-8 flex flex-col items-center gap-3"
        >
          {/* Mouse outline */}
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5 relative">
            {/* Scrolling dot inside */}
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 rounded-full bg-white/70"
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium">Scroll</span>
        </motion.div>
      </motion.div>

      <SectionDivider />

      {/* Subtle Bottom Glow to help transition */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" />
    </section>
  );
}
