import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionGlowProps {
    primaryPosition?: "left" | "right";
    accentPosition?: "left" | "right";
    opacity?: number;
    className?: string;
}

export function SectionGlow({
    primaryPosition = "left",
    accentPosition = "right",
    opacity = 0.2,
    className
}: SectionGlowProps) {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Smooth out the scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Transform values based on scroll
    const primaryScale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
    const primaryY = useTransform(smoothProgress, [0, 1], [-50, 50]);
    const accentScale = useTransform(smoothProgress, [0, 0.5, 1], [1.2, 0.8, 1.2]);
    const accentY = useTransform(smoothProgress, [0, 1], [50, -50]);
    const globalOpacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, opacity, opacity, 0]);

    return (
        <motion.div
            ref={ref}
            style={{ opacity: globalOpacity }}
            className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}
        >
            {/* Primary Glow Circle */}
            <motion.div
                style={{
                    scale: primaryScale,
                    y: primaryY,
                }}
                className={cn(
                    "absolute w-[50vw] h-[50vw] bg-primary rounded-full blur-[140px] mix-blend-screen",
                    primaryPosition === "left" ? "top-[-10%] left-[-15%]" : "bottom-[-10%] right-[-15%]"
                )}
            />

            {/* Accent Glow Circle */}
            <motion.div
                style={{
                    scale: accentScale,
                    y: accentY,
                }}
                className={cn(
                    "absolute w-[45vw] h-[45vw] bg-accent rounded-full blur-[140px] mix-blend-screen",
                    accentPosition === "left" ? "bottom-[-10%] left-[-15%]" : "top-[-10%] right-[-15%]"
                )}
            />

            {/* Central Indigo Tint */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[40vw] bg-indigo-500/10 rounded-full blur-[150px]" />
        </motion.div>
    );
}
