import { useRef } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered
gsap.registerPlugin(ScrollTrigger);

export function SynergyScrollSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const headlines = gsap.utils.toArray<HTMLElement>(".dynamic-headline");
        const cards = gsap.utils.toArray<HTMLElement>(".synergy-card");

        // Initial setup: Hide all except the first one
        // We set position absolute to overlap them perfectly for the "fixed" effect
        gsap.set(headlines, { y: 100, opacity: 0, position: "absolute", top: "50%", translateY: "-50%", left: 0, width: "100%" });
        gsap.set(cards, { y: 100, opacity: 0, position: "absolute", top: "50%", translateY: "-50%", left: 0, width: "100%" });

        // Show first elements immediately
        gsap.set(headlines[0], { y: 0, opacity: 1 });
        gsap.set(cards[0], { y: 0, opacity: 1 });

        // Create the main pinned timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=300%", // Scroll distance (3x screen height) controls the scrubbing
                pin: true,     // Fix the section in place
                scrub: 1,      // Smooth scrubbing
                anticipatePin: 1
            }
        });

        // Create transitions between steps
        // Step 1 -> 2
        tl.to([headlines[0], cards[0]], { y: -100, opacity: 0, duration: 1, ease: "power2.inOut" })
            .to([headlines[1], cards[1]], { y: 0, opacity: 1, duration: 1, ease: "power2.inOut" }, "<");

        // Step 2 -> 3
        tl.to([headlines[1], cards[1]], { y: -100, opacity: 0, duration: 1, ease: "power2.inOut" })
            .to([headlines[2], cards[2]], { y: 0, opacity: 1, duration: 1, ease: "power2.inOut" }, "<");

    }, { scope: sectionRef });

    const contentPanels = [
        {
            id: "panel-0",
            title: "L'Intelligence Artificielle",
            text: "Notre moteur neural analyse des milliers de points de données pour comprendre non seulement les compétences, mais aussi le potentiel latent, la personnalité et l'adéquation culturelle.",
            features: ["Analyse sémantique profonde", "Prédiction de réussite", "Matching comportemental"],
            headline: (
                <>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 block mb-2">INTELLIGENCE</span>
                    <span className="text-foreground text-4xl block font-light tracking-wide">BIOLOGIQUE</span>
                </>
            )
        },
        {
            id: "panel-1",
            title: "La Synergie Humaine",
            text: "Au-delà des algorithmes, nous créons des connexions humaines authentiques. La technologie s'efface pour laisser place à la rencontre entre une ambition et une opportunité.",
            features: ["Validation par experts", "Alignement des valeurs", "Expérience fluide"],
            headline: (
                <>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600 block mb-2">SYNERGIE</span>
                    <span className="text-foreground text-4xl block font-light tracking-wide">UNIVERSELLE</span>
                </>
            )
        },
        {
            id: "panel-2",
            title: "Le Futur du Travail",
            text: "Nous ne suivons pas les tendances, nous les créons. Préparez votre organisation pour les défis de demain avec une force de travail agile, qualifiée et visionnaire.",
            features: ["Anticipation des métiers", "Formation continue", "Écosystème évolutif"],
            headline: (
                <>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 block mb-2">FUTUR</span>
                    <span className="text-foreground text-4xl block font-light tracking-wide">CONNECTÉ</span>
                </>
            )
        }
    ];

    return (
        <section ref={sectionRef} className="h-screen w-full bg-background overflow-hidden relative flex items-center">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-background to-transparent z-10" />

            <div className="container px-6 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center h-full relative z-20">

                {/* Left Column: Dynamic Headlines */}
                <div className="relative h-64 lg:h-96 w-full flex items-center">
                    {contentPanels.map((panel, idx) => (
                        <h2 key={idx} className="dynamic-headline text-5xl lg:text-7xl xl:text-8xl font-black leading-none">
                            {panel.headline}
                        </h2>
                    ))}
                </div>

                {/* Right Column: Dynamic Cards */}
                <div className="relative h-[60vh] w-full flex items-center justify-center lg:justify-start lg:pl-12">
                    {contentPanels.map((panel, idx) => (
                        <div key={idx} className="synergy-card w-full max-w-xl">
                            <div className="p-8 lg:p-12 rounded-[2.5rem] bg-secondary/50 backdrop-blur-md border border-border/50 shadow-2xl hover:border-primary/30 transition-colors duration-500">
                                <div className="mb-8">
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                                        Module 0{idx + 1}
                                    </span>
                                    <h3 className="text-3xl font-black text-foreground">{panel.title}</h3>
                                </div>

                                <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-light">
                                    {panel.text}
                                </p>

                                <ul className="space-y-4 mb-8">
                                    {panel.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-6 border-t border-border/10">
                                    <a href="#" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors group">
                                        En Savoir Plus
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
