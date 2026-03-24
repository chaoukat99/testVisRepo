import { Check } from "lucide-react";
import { motion } from "framer-motion";

export interface CheckboxOption {
    value: string;
    label: string;
    description?: string;
}

interface CheckboxGroupProps {
    label: string;
    options: CheckboxOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
    layout?: "vertical" | "horizontal" | "grid";
}

export function CheckboxGroup({
    label,
    options,
    selected,
    onChange,
    layout = "vertical",
}: CheckboxGroupProps) {
    const toggleOption = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const getGridClass = () => {
        switch (layout) {
            case "horizontal":
                return "grid-cols-2 md:grid-cols-3";
            case "grid":
                return "grid-cols-2 md:grid-cols-4";
            default:
                return "grid-cols-1";
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
                {label}
                {selected.length > 0 && (
                    <span className="text-xs text-muted-foreground ml-2">
                        ({selected.length} selected)
                    </span>
                )}
            </label>

            <div className={`grid gap-3 ${getGridClass()}`}>
                {options.map((option) => {
                    const isChecked = selected.includes(option.value);
                    return (
                        <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => toggleOption(option.value)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-3 rounded-lg border-2 text-left transition-all ${isChecked
                                    ? "border-primary bg-primary/10"
                                    : "border-border/50 hover:border-border bg-secondary/20"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Checkbox */}
                                <div
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${isChecked
                                            ? "border-primary bg-primary"
                                            : "border-muted-foreground"
                                        }`}
                                >
                                    {isChecked && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <Check className="w-3 h-3 text-primary-foreground" />
                                        </motion.div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div
                                        className={`font-medium text-sm ${isChecked ? "text-primary" : "text-foreground"
                                            }`}
                                    >
                                        {option.label}
                                    </div>
                                    {option.description && (
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {option.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
