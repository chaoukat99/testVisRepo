import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Check, GripHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const INTERVIEW_QUOTES = [
    "Recherchez l'entreprise avant l'entretien !",
    "Soyez prêt à parler de vos points faibles.",
    "Le langage corporel est essentiel.",
    "Préparez des questions pour le recruteur.",
    "Mettez en avant vos réalisations concrètes.",
    "Soyez ponctuel, c'est la base.",
    "Révisez votre CV avant l'appel.",
    "Souriez, cela s'entend même au téléphone."
];

const POSITIONS = [
    { top: "85%", left: "90%" }, // Bottom Right
    { top: "85%", left: "10%" }, // Bottom Left
    { top: "20%", left: "90%" }, // Top Right
];

interface AIAvatarProps {
    message?: string | null;
    position?: { top: string; left: string } | null;
    currentStep?: number;
    totalSteps?: number;
    onClose?: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

export function AIAvatar({ message, position, currentStep, totalSteps, onClose, onNext, onPrev }: AIAvatarProps) {
    const [quote, setQuote] = useState(INTERVIEW_QUOTES[0]);
    const [currentPos, setCurrentPos] = useState(POSITIONS[0]);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const isControlled = !!message;

    // Handle Resize
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Random Quote Cycle
    useEffect(() => {
        if (isControlled) {
            setIsVisible(true);
            return;
        }

        let hideTimeout: NodeJS.Timeout;
        let showTimeout: NodeJS.Timeout;

        const runCycle = () => {
            hideTimeout = setTimeout(() => {
                setIsVisible(false);
                showTimeout = setTimeout(() => {
                    const nextPosIndex = Math.floor(Math.random() * POSITIONS.length);
                    const nextQuoteIndex = Math.floor(Math.random() * INTERVIEW_QUOTES.length);
                    setCurrentPos(POSITIONS[nextPosIndex]);
                    setQuote(INTERVIEW_QUOTES[nextQuoteIndex]);
                    setIsVisible(true);
                    runCycle();
                }, 10000); // Reappear after 10s
            }, 8000); // Stay visible for 8s
        };

        runCycle();

        return () => {
            clearTimeout(hideTimeout);
            clearTimeout(showTimeout);
        };
    }, [isControlled]);

    const constraintsRef = useRef(null);

    // Calculate Position styles
    const getPositionStyles = () => {
        if (isControlled) {
            // Force center for tutorial mode on all devices for better visibility
            return { top: '50%', left: '50%', x: '-50%', y: '-50%' };
        }

        if (isMobile) {
            // Idle mobile: Bottom right
            return { top: 'auto', bottom: '80px', left: 'auto', right: '20px', x: 0, y: 0 };
        }

        // Idle Desktop
        return { top: currentPos.top, left: currentPos.left, x: '-50%', y: '-50%' };
    };

    return (
        <div ref={constraintsRef} className="fixed inset-0 z-[100001] pointer-events-none overflow-hidden h-screen w-screen">
            <AnimatePresence mode="wait">
                {isVisible && (
                    <motion.div
                        key="avatar-container"
                        drag
                        dragConstraints={constraintsRef}
                        dragElastic={0.1}
                        className={cn(
                            "absolute flex flex-col items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing",
                            isControlled ? "w-[90vw] md:w-auto" : "w-auto"
                        )}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            ...getPositionStyles()
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 25
                        }}
                    >
                        {/* Cloud Quote Bubble */}
                        <motion.div
                            layout
                            className={cn(
                                "relative rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl transition-colors duration-300",
                                // Light/Dark mode compatible styles:
                                "bg-white/90 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100",
                                isControlled ? "mb-6 p-6 min-w-[300px] max-w-md shadow-zinc-500/20 dark:shadow-black/50" : "mb-4 p-4 max-w-[200px]"
                            )}
                        >
                            {/* Drag Indicator hint */}
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-20 dark:opacity-10">
                                <GripHorizontal className="w-8 h-4" />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 pointer-events-none" />

                            {/* Header / Step Count */}
                            {isControlled && totalSteps && totalSteps > 0 && (
                                <div className="flex items-center justify-between mb-3 border-b border-zinc-200 dark:border-white/5 pb-2">
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
                                        Guide IA
                                    </span>
                                    <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                                        {currentStep! + 1} <span className="text-zinc-300 dark:text-zinc-600">/</span> {totalSteps}
                                    </span>
                                </div>
                            )}

                            {/* Content */}
                            <p className={cn(
                                "text-center relative z-10",
                                isControlled ? "text-base font-medium leading-relaxed" : "text-xs italic text-muted-foreground"
                            )}>
                                {isControlled ? message : <b>{`"${quote}"`}</b>}
                            </p>

                            {/* Tour Controls */}
                            {isControlled && (
                                <div className="flex items-center justify-between gap-3 mt-5 pt-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onClose?.(); }}
                                        className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-400 hover:text-red-500 transition-colors"
                                        title="Fermer le guide"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
                                            disabled={!onPrev}
                                            className={cn(
                                                "p-2 rounded-full transition-colors flex items-center justify-center w-10 h-10",
                                                onPrev
                                                    ? "hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-200"
                                                    : "opacity-30 cursor-not-allowed text-zinc-400"
                                            )}
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>

                                        {onNext ? (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onNext(); }}
                                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white text-xs font-bold uppercase tracking-wide transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                                            >
                                                Suivant
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onClose?.(); }}
                                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white text-xs font-bold uppercase tracking-wide transition-all shadow-lg shadow-green-500/20 active:scale-95"
                                            >
                                                Terminer
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Bubble Pointer */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-zinc-900 border-b border-r border-zinc-200 dark:border-zinc-800 rotate-45 transform transition-colors duration-300" />
                        </motion.div>

                        {/* Avatar Visuals */}
                        <div className="relative group z-[105]">
                            {/* Setup Pulse Ring */}
                            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full scale-110 animate-pulse" />

                            {/* Main Avatar Circle */}
                            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] bg-gradient-to-br from-cyan-500 via-purple-500 to-blue-500 shadow-xl shadow-cyan-500/20">
                                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-black backdrop-blur-sm">
                                    <img
                                        src="/images/avatar.png"
                                        alt="AI Assistant"
                                        draggable={false}
                                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            // Fallback if image missing
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-cyan-500 dark:text-cyan-400 font-bold text-xs bg-zinc-100 dark:bg-zinc-800">AI</div>';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Status Indicator */}
                            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center border-2 border-white dark:border-black">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
