
import { motion } from "framer-motion";
import { Phone, Mic, Video, MessageSquare, X } from "lucide-react";
import agentAvatar from "@/assets/ai-agent-avatar-wide.png";

export const AgentCallWidget = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative w-full max-w-lg mx-auto perspective-1000"
        >
            {/* Animated Border Container */}
            <div className="relative group" style={{ marginTop: -200 }}>
                {/* Rotating Gradient Border */}
                <div className="absolute -inset-[3px] bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-[26px] opacity-75 blur-sm animate-spin-slow-reverse group-hover:opacity-100 transition duration-500" />
                <div className="absolute -inset-[3px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-[26px] opacity-75 blur-sm animate-spin-slow" />

                {/* Main Card */}
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl shadow-purple-500/30">

                    {/* Tech Corners */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-purple-400 rounded-tl-lg z-30 opacity-80" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-purple-400 rounded-tr-lg z-30 opacity-80" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-purple-400 rounded-bl-lg z-30 opacity-80" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-purple-400 rounded-br-lg z-30 opacity-80" />

                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                            <span className="text-[10px] font-mono tracking-widest text-white/90">AGENT IA • EN DIRECT</span>
                        </div>
                        <div className="px-2 py-1 rounded-full bg-white/10 text-[10px] font-medium text-white/90 border border-white/5">
                            00:12
                        </div>
                    </div>

                    {/* Video Feed */}
                    <div className="relative aspect-[16/10] w-full bg-gray-900 group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-20" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/60 z-10 pointer-events-none" />

                        {/* Static Image / GIF */}
                        <img
                            src="/images/AI-talking-avatar.gif"
                            alt="Avatar Agent IA OpenIn en pleine interaction vidéo"
                            className="relative w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700 ease-out z-0"
                        />

                        {/* Scanning Line & Mesh Effect */}
                        <div className="absolute inset-0 bg-scan-line opacity-15 pointer-events-none z-30 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 z-10" />

                        {/* Audio Overlay (Fake Visualization) */}
                        <div className="absolute bottom-24 left-8 flex items-end gap-1 h-8 z-30">
                            {[1, 2, 3, 4, 3, 2, 1, 2, 4, 2].map((n, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [10, 25, 10] }}
                                    transition={{ duration: 0.5 / n + 0.1, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-1 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                                />
                            ))}
                        </div>

                        {/* User Camera Frame (PiP) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.5, duration: 0.8 }}
                            className="absolute bottom-4 right-4 w-32 aspect-video rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl z-40 group/user"
                        >
                            <img
                                src="/images/user-caller.png"
                                alt="Consultant en entretien vidéo via OpenIn Partners"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <div className="absolute top-1 right-1 flex gap-0.5">
                                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Floating Chat Bubble */}
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 2, duration: 0.5 }}
                        className="absolute top-20 right-4 max-w-[200px] p-3 rounded-2xl rounded-tr-sm bg-black/60 backdrop-blur-xl border border-white/10 z-30 shadow-xl"
                    >
                        <p className="text-xs text-white leading-relaxed font-light">
                            Analyse du profil...
                            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300 font-medium">Match parfait trouvé! 98% de compatibilité.</span>
                        </p>
                    </motion.div>


                    {/* Controls */}
                    <div className="absolute bottom-4 left-6 flex items-center gap-2 z-20 w-max">
                        <div className="flex items-center gap-2.5 p-1.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white hover:text-purple-300 group">
                                <Mic className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            </button>
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white hover:text-purple-300 group">
                                <Video className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            </button>
                            <button className="p-2.5 rounded-lg bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 transition-all text-white group">
                                <Phone className="w-4 h-4 rotate-[135deg] group-hover:scale-110 transition-transform" />
                            </button>
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white hover:text-purple-300 group">
                                <MessageSquare className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Ambient Glow */}
            <div className="absolute -inset-10 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-3xl -z-10 rounded-full opacity-40 animate-pulse-slow" />
        </motion.div>
    );
};
