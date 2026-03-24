import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillSelectorProps {
    label: string;
    selectedSkills: string[];
    onSkillsChange: (skills: string[]) => void;
    suggestions: string[];
    placeholder?: string;
}

export function SkillSelector({
    label,
    selectedSkills,
    onSkillsChange,
    suggestions = [],
    placeholder = "Ajouter une autre compétence...",
}: SkillSelectorProps) {
    const [inputValue, setInputValue] = useState("");

    const toggleSkill = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            onSkillsChange(selectedSkills.filter((s) => s !== skill));
        } else {
            onSkillsChange([...selectedSkills, skill]);
        }
    };

    const addCustomSkill = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !selectedSkills.includes(trimmed)) {
            onSkillsChange([...selectedSkills, trimmed]);
            setInputValue("");
        }
    };

    const removeCustomSkill = (skill: string) => {
        onSkillsChange(selectedSkills.filter((s) => s !== skill));
    };

    const customSkills = selectedSkills.filter((s) => !suggestions.includes(s));

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <label className="block text-sm font-medium text-foreground">
                    {label}
                </label>
                <p className="text-[10px] text-muted-foreground italic">
                    (Sélectionnez parmi les propositions ou ajoutez-en de nouvelles)
                </p>
            </div>

            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {suggestions.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                        <motion.div
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                                cursor-pointer group relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
                                ${isSelected
                                    ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                                    : "bg-secondary/30 border-transparent hover:bg-secondary/50 hover:border-border text-muted-foreground"
                                }
                            `}
                        >
                            <div className={`
                                flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors
                                ${isSelected
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-muted-foreground/30 group-hover:border-primary/50"
                                }
                            `}>
                                {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                            </div>
                            <span className={`text-sm font-medium ${isSelected ? "text-foreground" : ""}`}>
                                {skill}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Custom Skills Section */}
            <div className="space-y-3 pt-2">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
                            placeholder={placeholder}
                            className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={addCustomSkill}
                        disabled={!inputValue.trim()}
                        className="px-4 py-2 rounded-lg bg-secondary/50 text-foreground hover:bg-secondary border border-border transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Ajouter</span>
                    </button>
                </div>

                {/* Display Custom Skills */}
                <AnimatePresence>
                    {customSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {customSkills.map((skill) => (
                                <motion.span
                                    key={skill}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground border border-border"
                                >
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeCustomSkill(skill)}
                                        className="hover:text-destructive transition-colors ml-1"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </motion.span>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
