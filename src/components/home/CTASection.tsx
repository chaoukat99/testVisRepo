import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Brain, Users, Zap, Target, TrendingUp, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { SectionGlow } from "@/components/ui/SectionGlow";

gsap.registerPlugin(ScrollTrigger);

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  connections: number[];
}

interface CTASectionProps {
  type?: "company" | "consultant" | "freelancer";
}

export function CTASection({ type }: CTASectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Neural network particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      if (!canvas || !containerRef.current) return;
      canvas.width = containerRef.current.offsetWidth;
      canvas.height = containerRef.current.offsetHeight;
    };

    updateCanvasSize();

    const particles: Particle[] = [];
    const particleCount = 80;
    const maxDistance = 150;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        connections: []
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${particle.alpha})`;
        ctx.fill();

        // Draw connections
        particles.forEach((otherParticle, j) => {
          if (i === j) return;

          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const alpha = (1 - distance / maxDistance) * 0.2;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // GSAP Animations
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      }
    });

    // Animate title with split text effect
    tl.from(".cta-badge", {
      scale: 0,
      rotation: -180,
      duration: 0.8,
      ease: "back.out(2)"
    })
      .from(".cta-title", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
      }, "-=0.4")
      .from(".cta-subtitle", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6");

    // Animate stat cards with 3D effect
    const statCards = gsap.utils.toArray(".stat-card");
    tl.from(statCards, {
      y: 100,
      opacity: 0,
      rotationX: -90,
      transformOrigin: "center bottom",
      stagger: 0.15,
      duration: 0.8,
      ease: "back.out(1.5)"
    }, "-=0.4");

    // Continuous floating animation for stat cards
    statCards.forEach((card: any, i) => {
      gsap.to(card, {
        y: -15,
        duration: 2 + i * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2
      });
    });

    // Animate buttons
    tl.from(".cta-buttons", {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.3");

    // Pulsing glow effect
    gsap.to(".glow-orb", {
      scale: 1.5,
      opacity: 0.3,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Data stream animation
    gsap.to(".data-stream", {
      y: 100,
      opacity: 0,
      duration: 2,
      stagger: {
        each: 0.3,
        repeat: -1,
        repeatDelay: 0.5
      },
      ease: "none"
    });

  }, { scope: containerRef });

  const stats = [
    { icon: Brain, value: "98%", label: t('cta.stats.ai_accuracy.label'), color: "from-purple-500 to-pink-500" },
    { icon: Users, value: "10k+", label: t('cta.stats.talents_connected.label'), color: "from-blue-500 to-cyan-500" },
    { icon: Zap, value: "3x", label: t('cta.stats.faster.label'), color: "from-orange-500 to-yellow-500" },
    { icon: Target, value: "95%", label: t('cta.stats.success_rate.label'), color: "from-green-500 to-emerald-500" }
  ];

  const renderButtons = () => {
    if (type === "consultant" || type === "freelancer") {
      return (
        <>
          <Button
            variant="hero"
            size="xl"
            asChild
            className="group relative overflow-hidden"
          >
            <Link to="/consultant-register" className="relative z-10">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Sparkles className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{t('cta.btn_start')}</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="xl"
            asChild
            className="group border-2 hover:border-primary/50 hover:bg-primary/5"
          >
            <Link to="/consultant-login" className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {t('navbar.login')}
            </Link>
          </Button>
        </>
      );
    }

    // Default / Company
    return (
      <>
        <Button
          variant="hero"
          size="xl"
          asChild
          className="group relative overflow-hidden"
        >
          <Link to="/ai-matching-demo" className="relative z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Sparkles className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{t('cta.btn_demo')}</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>

        <Button
          variant="outline"
          size="xl"
          asChild
          className="group border-2 hover:border-primary/50 hover:bg-primary/5"
        >
          <Link to="/company-register" className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {t('cta.btn_start')}
          </Link>
        </Button>
      </>
    );
  };

  return (
    <section ref={containerRef} className="relative py-16 overflow-hidden bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Neural Network Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40"
      />

      {/* Animated gradient orbs */}
      <div className="glow-orb absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
      <div className="glow-orb absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" />

      {/* Data streams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="data-stream absolute w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent"
            style={{
              left: `${15 + i * 15}%`,
              top: '-100px',
              height: '100px'
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="cta-badge inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-primary border border-primary/20 mb-8 backdrop-blur-xl">
            <Sparkles className="w-5 h-5 animate-pulse" />
            {t('cta.badge')}
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <h2 className="cta-title text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {t('cta.title_part1')}{" "}
            <span className="relative inline-block">
              <span className="gradient-text bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                {t('cta.title_highlight')}
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 2 100 2 150 6C200 10 250 10 298 6" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <br />
            {t('cta.  ')}
          </h2>

          <p className="cta-subtitle text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('cta.subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card group relative p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-md hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20"
              style={{ perspective: '1000px' }}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />

              <div className="relative z-10 text-center">
                <div className="inline-flex p-3 rounded-xl bg-secondary/50 group-hover:bg-primary/20 transition-colors duration-300 mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
          {renderButtons()}
        </div>

        {/* Trust badge */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">{t('cta.trust_text')}</p>
          <div className="flex items-center justify-center gap-8 opacity-50">
            {[Network, Brain, Zap, Target].map((Icon, i) => (
              <Icon key={i} className="w-8 h-8" />
            ))}
          </div>
        </div>
      </div>
      <SectionDivider fill="fill-card/50" />
    </section>
  );
}
