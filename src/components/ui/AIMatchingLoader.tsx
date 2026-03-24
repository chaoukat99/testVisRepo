import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, Network, Zap } from "lucide-react";

const LOADING_MESSAGES = [
    "Comprendre spécification...",
    "Analyse Euronnelle (AI)...",
    "Préparation des résultats...",
];

export function AIMatchingLoader({ message }: { message?: string }) {
    const [msgIdx, setMsgIdx] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setMsgIdx(prev => (prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const loadingMessage = message || LOADING_MESSAGES[msgIdx];

    return (
        <div className="flex flex-col items-center justify-center gap-8">
            {/* Central AI Brain Animation */}
            <div className="relative w-40 h-40">
                {/* Outer glow */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Neural network lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    {[...Array(8)].map((_, i) => {
                        const angle = (i * 360) / 8;
                        const x1 = 50 + 35 * Math.cos((angle * Math.PI) / 180);
                        const y1 = 50 + 35 * Math.sin((angle * Math.PI) / 180);
                        return (
                            <motion.line
                                key={i}
                                x1="50"
                                y1="50"
                                x2={x1}
                                y2={y1}
                                stroke="url(#gradient)"
                                strokeWidth="0.5"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{
                                    pathLength: [0, 1, 0],
                                    opacity: [0, 0.6, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.1,
                                }}
                            />
                        );
                    })}
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--accent))" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Orbiting nodes */}
                {[Sparkles, Network, Zap].map((Icon, i) => (
                    <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2"
                        animate={{
                            rotate: 360,
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.5,
                        }}
                        style={{
                            transformOrigin: "0 0",
                        }}
                    >
                        <div className="w-24 h-24 -ml-12 -mt-12">
                            <motion.div
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm flex items-center justify-center border border-primary/20"
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.3,
                                }}
                            >
                                <Icon className="w-4 h-4 text-primary" />
                            </motion.div>
                        </div>
                    </motion.div>
                ))}

                {/* Central Brain */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                        <Brain className="w-8 h-8 text-primary-foreground" />
                    </div>
                </motion.div>

                {/* Pulsing ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                />
            </div>

            {/* Loading Text */}
            <div className="text-center">
                <motion.h3
                    className="text-xl font-semibold text-foreground mb-2"
                    animate={{
                        opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {loadingMessage}
                </motion.h3>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mt-4">
                    {[0, 1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{
                                background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))",
                            }}
                            animate={{
                                scale: [0.8, 1.3, 0.8],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
