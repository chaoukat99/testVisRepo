import { useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface MultiSelectOption {
    value: string;
    label: string;
}

interface MultiSelectProps {
    label: string;
    options: MultiSelectOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
}

export function MultiSelect({
    label,
    options,
    selected,
    onChange,
    placeholder = "Select options...",
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOption = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const getSelectedLabels = () => {
        return options
            .filter((opt) => selected.includes(opt.value))
            .map((opt) => opt.label)
            .join(", ");
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
                {label}
            </label>

            <div className="relative">
                {/* Trigger Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="futuristic-input w-full text-left flex items-center justify-between"
                >
                    <span className={selected.length > 0 ? "text-foreground" : "text-muted-foreground"}>
                        {selected.length > 0 ? getSelectedLabels() : placeholder}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {selected.length} selected
                    </span>
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-20 w-full mt-2 glass-card p-2 max-h-64 overflow-y-auto"
                        >
                            {options.map((option) => {
                                const isSelected = selected.includes(option.value);
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => toggleOption(option.value)}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between transition-colors ${isSelected
                                                ? "bg-primary/20 text-primary"
                                                : "hover:bg-secondary/50"
                                            }`}
                                    >
                                        <span>{option.label}</span>
                                        {isSelected && (
                                            <Check className="w-4 h-4 text-primary" />
                                        )}
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Selected chips */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {options
                        .filter((opt) => selected.includes(opt.value))
                        .map((option) => (
                            <span
                                key={option.value}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-primary/20 text-primary border border-primary/30"
                            >
                                {option.label}
                            </span>
                        ))}
                </div>
            )}
        </div>
    );
}
