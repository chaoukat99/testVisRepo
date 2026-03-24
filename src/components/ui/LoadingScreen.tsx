import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
    isLoading: boolean;
    message?: string;
}

const containerVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
    exit: {
        opacity: 0,
        transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
};

const charVariants = {
    initial: { opacity: 0, scale: 2, filter: "blur(10px)" },
    animate: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
};

const word1 = "OPEN".split("");
const word2 = "INNOVATION".split("");
const word3 = "PARTNERS".split("");

export function LoadingScreen({ isLoading, message }: LoadingScreenProps) {
    const [statusIndex, setStatusIndex] = useState(0);
    const statuses = [
        "INITIALIZING CORE",
        "NEURAL_LINKING",
        "OPTIMIZING SYNERGY",
        "READY"
    ];

    useEffect(() => {
        if (!isLoading) return;
        const interval = setInterval(() => {
            setStatusIndex(prev => (prev + 1) % statuses.length);
        }, 600);
        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="loader-root"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5 } }}
                    className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#020617]"
                >
                    {/* Atmospheric effects */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.08)_0%,transparent_70%)]" />
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }} />

                    <motion.div
                        variants={containerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="relative flex flex-col items-center"
                    >
                        {/* Word 1: OPEN - Large, Bold */}
                        <div className="flex gap-4 mb-2">
                            {word1.map((char, i) => (
                                <motion.span
                                    key={i}
                                    variants={charVariants}
                                    className="text-7xl md:text-9xl font-black text-white tracking-widest drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>

                        {/* Word 2 & 3: INNOVATION PARTNERS - Modern Tracking */}
                        <div className="flex flex-col md:flex-row gap-4 mb-16 items-center">
                            <div className="flex gap-1">
                                {word2.map((char, i) => (
                                    <motion.span
                                        key={i}
                                        variants={charVariants}
                                        className="text-xl md:text-3xl font-light tracking-[0.6em] text-primary uppercase"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </div>
                            <div className="flex gap-1">
                                {word3.map((char, i) => (
                                    <motion.span
                                        key={i}
                                        variants={charVariants}
                                        className="text-xl md:text-3xl font-bold tracking-[0.6em] text-white/80 uppercase"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        {/* Dynamic Loader Bars */}
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex gap-1 h-8 items-end">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [8, 32, 8], opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                                        className="w-1 bg-primary/60 rounded-full"
                                    />
                                ))}
                            </div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[10px] font-mono tracking-[0.5em] text-white/30 uppercase text-center"
                            >
                                {message || statuses[statusIndex]}
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Hardware Accents */}
                    <div className="absolute top-12 left-12 transform -rotate-90 origin-left">
                        <p className="text-[9px] font-mono text-white/10 tracking-[1em]">SYSTEM_BOOT_SEQUENCE</p>
                    </div>

                    <div className="absolute bottom-12 right-12 flex flex-col items-end">
                        <div className="flex gap-2 mb-2">
                            <div className="w-1 h-1 bg-primary animate-pulse" />
                            <div className="w-1 h-1 bg-white/20" />
                            <div className="w-1 h-1 bg-white/20" />
                        </div>
                        <p className="text-[8px] font-mono text-white/20 tracking-widest">NETWORK_SECURE_V4</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
