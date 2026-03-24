import { motion } from "framer-motion";
import { Users, Building2, Sparkles, ArrowRight } from "lucide-react";

export function SynergyLoader() {
    return (
        <div className="flex flex-col items-center justify-center gap-8">
            <div className="relative w-64 h-32">
                {/* Consultant side */}
                <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2"
                    animate={{
                        x: [0, -10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-500/20 border-2 border-emerald-500/50 flex items-center justify-center backdrop-blur-sm">
                        <Users className="w-8 h-8 text-emerald-500" />
                    </div>
                </motion.div>

                {/* Company side */}
                <motion.div
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    animate={{
                        x: [0, 10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 border-2 border-blue-500/50 flex items-center justify-center backdrop-blur-sm">
                        <Building2 className="w-8 h-8 text-blue-500" />
                    </div>
                </motion.div>

                {/* Connecting energy particles */}
                {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                        style={{
                            background: "linear-gradient(to right, rgb(16, 185, 129), rgb(59, 130, 246))",
                        }}
                        initial={{
                            x: -112,
                            y: -4,
                            opacity: 0,
                            scale: 0,
                        }}
                        animate={{
                            x: 112,
                            y: -4 + Math.sin(i) * 20,
                            opacity: [0, 1, 1, 0],
                            scale: [0, 1, 1, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3,
                        }}
                    />
                ))}

                {/* Center synergy icon */}
                <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{
                        rotate: [0, 180, 360],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-primary-foreground" />
                    </div>
                </motion.div>

                {/* Connection arrows */}
                <motion.div
                    className="absolute left-1/4 top-1/2 -translate-y-1/2"
                    animate={{
                        x: [0, 10, 0],
                        opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <ArrowRight className="w-6 h-6 text-primary" />
                </motion.div>

                <motion.div
                    className="absolute right-1/4 top-1/2 -translate-y-1/2 rotate-180"
                    animate={{
                        x: [0, -10, 0],
                        opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.75,
                    }}
                >
                    <ArrowRight className="w-6 h-6 text-accent" />
                </motion.div>
            </div>

            {/* Loading Text */}
            <motion.div
                className="text-center"
                animate={{
                    opacity: [0.7, 1, 0.7],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Création de synergies...
                </h3>
            </motion.div>
        </div>
    );
}
