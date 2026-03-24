import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function CornerGlow() {
    const { scrollYProgress } = useScroll();

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 50,
        damping: 20,
    });

    // Global parallax shifts
    const shiftY = useTransform(smoothProgress, [0, 1], [0, -100]);
    const shiftX = useTransform(smoothProgress, [0, 1], [0, 50]);
    const extraScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.1, 1]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[-5] overflow-hidden">
            {/* Top Left Glow */}
            <motion.div
                style={{ y: shiftY, x: shiftX, scale: extraScale }}
                className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-primary/15 rounded-full blur-[130px] animate-pulse-slow"
            />

            {/* Bottom Right Glow */}
            <motion.div
                style={{ y: useTransform(smoothProgress, [0, 1], [0, 100]), scale: extraScale, animationDelay: '2s' }}
                className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] bg-accent/20 rounded-full blur-[130px] animate-pulse-slow"
            />

            {/* Mid Right Glow */}
            <motion.div
                style={{ y: useTransform(smoothProgress, [0, 1], [0, -50]), animationDelay: '4s' }}
                className="absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow"
            />
        </div>
    );
}
