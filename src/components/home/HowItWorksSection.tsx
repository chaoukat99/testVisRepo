import { UserPlus, FileSearch, Sparkles, Handshake, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { SectionGlow } from "@/components/ui/SectionGlow";

export function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: UserPlus,
      title: t('how_it_works.steps.step1.title'),
      description: t('how_it_works.steps.step1.desc'),
      step: "01",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: FileSearch,
      title: t('how_it_works.steps.step2.title'),
      description: t('how_it_works.steps.step2.desc'),
      step: "02",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Sparkles,
      title: t('how_it_works.steps.step3.title'),
      description: t('how_it_works.steps.step3.desc'),
      step: "03",
      gradient: "from-amber-400 to-orange-600"
    },
    {
      icon: Handshake,
      title: t('how_it_works.steps.step4.title'),
      description: t('how_it_works.steps.step4.desc'),
      step: "04",
      gradient: "from-emerald-400 to-teal-600"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <section className="relative py-24 bg-card/10 dark:bg-card/30 overflow-hidden">
      {/* Background Decorative Elemets */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent z-0 opacity-50" />

      <div className="container px-6 relative z-10">
        <SectionHeading
          badge={t('how_it_works.badge')}
          title={t('how_it_works.title')}
          description={t('how_it_works.description')}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative grid grid-cols-1 md:grid-cols-4 gap-8 mt-20"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={stepVariants}
              className="relative group"
            >
              {/* Connector Arrow for Desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-12 left-[calc(100%-20px)] w-10 h-10 items-center justify-center z-20 text-muted-foreground/50">
                  <ArrowRight className="w-6 h-6 animate-pulse-slow" />
                </div>
              )}

              {/* Step Card */}
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon Circle */}
                <div className={cn(
                  "w-24 h-24 rounded-3xl flex items-center justify-center relative shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                  "bg-gradient-to-br", step.gradient
                )}>
                  {/* Outer Glow */}
                  <div className={cn(
                    "absolute inset-0 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity",
                    "bg-gradient-to-br", step.gradient
                  )} />

                  {/* Inner Glass Effect */}
                  <div className="absolute inset-[2px] rounded-[22px] bg-white/10 dark:bg-black/10 backdrop-blur-sm" />

                  <step.icon className="w-10 h-10 text-white relative z-10 drop-shadow-lg" />

                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-background text-foreground font-black flex items-center justify-center text-sm shadow-xl border border-border/10 z-20">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4 px-4">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto rounded-full group-hover:w-24 transition-all duration-500" />
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Animated Background Pulse */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Large Decorative Number background */}
      <div className="absolute -bottom-20 -left-20 text-[20rem] font-black text-foreground/[0.03] dark:text-white/[0.02] pointer-events-none select-none">
        STEPS
      </div>
      <SectionDivider />
    </section>
  );
}
