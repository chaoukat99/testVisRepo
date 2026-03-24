import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Shield, Zap } from "lucide-react";

export const getSeniorityDetails = (years: number) => {
    if (years < 3) return { label: "Junior", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: Zap, description: "0-3 ans" };
    if (years < 8) return { label: "Confirmé", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Star, description: "3-8 ans" };
    if (years < 15) return { label: "Senior", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", icon: Shield, description: "8-15 ans" };
    return { label: "Expert", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Trophy, description: "15+ ans" };
};

interface SenioritySliderProps {
    value: number;
    onChange: (value: number) => void;
    label?: string;
    className?: string;
    max?: number;
}

export function SenioritySlider({
    value,
    onChange,
    label = "Niveau d'expérience",
    className,
    max = 25,
}: SenioritySliderProps) {
    const details = getSeniorityDetails(value);
    const Icon = details.icon;

    return (
        <div className={cn("space-y-8 py-4", className)}>
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <Label className="text-base font-bold text-foreground">
                        {label}
                    </Label>
                    <p className="text-xs text-muted-foreground italic">
                        (Ajustez le curseur selon les années d'expérience)
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={details.label}
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -20 }}
                        className={cn(
                            "px-4 py-2 rounded-xl border flex items-center gap-2 shadow-sm",
                            details.bg,
                            details.border
                        )}
                    >
                        <Icon className={cn("w-4 h-4", details.color)} />
                        <div className="flex flex-col">
                            <span className={cn("text-xs font-bold leading-none mb-1", details.color)}>
                                {details.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium">
                                {details.description}
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="relative space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-black text-primary tracking-tight">
                        {value} <span className="text-lg text-muted-foreground font-medium uppercase tracking-widest">ans</span>
                    </span>
                </div>

                <div className="px-1">
                    <Slider
                        value={[value]}
                        min={0}
                        max={max}
                        step={1}
                        onValueChange={(vals) => onChange(vals[0])}
                        className="cursor-pointer"
                    />
                </div>

                {/* Markers with labels at set intervals */}
                <div className="relative h-6 mt-4">
                    <div className="absolute inset-0 flex justify-between px-1">
                        {[0, 3, 8, 15, 25].map((mark) => (
                            <div key={mark} className="flex flex-col items-center gap-1.5">
                                <div className={cn(
                                    "w-1 h-1 rounded-full transition-colors",
                                    value >= mark ? "bg-primary" : "bg-muted-foreground/30"
                                )} />
                                <span className={cn(
                                    "text-[9px] font-bold transition-all",
                                    value === mark ? "text-primary scale-110" : "text-muted-foreground/50"
                                )}>
                                    {mark}{mark === 25 ? '+' : ''}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Background label for intervals */}
                    <div className="absolute -top-10 inset-0 flex pointer-events-none opacity-20 px-1">
                        <div className="h-full flex-none" style={{ width: '12%' }}>
                            <span className="text-[8px] font-bold uppercase tracking-widest">Junior</span>
                        </div>
                        <div className="h-full flex-none" style={{ width: '20%' }}>
                            <span className="text-[8px] font-bold uppercase tracking-widest">Confirmé</span>
                        </div>
                        <div className="h-full flex-none" style={{ width: '28%' }}>
                            <span className="text-[8px] font-bold uppercase tracking-widest">Senior</span>
                        </div>
                        <div className="h-full flex-none" style={{ width: '40%' }}>
                            <span className="text-[8px] font-bold uppercase tracking-widest">Expert</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
