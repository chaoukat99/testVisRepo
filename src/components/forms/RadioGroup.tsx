import { motion } from "framer-motion";

export interface RadioOption {
    value: string;
    label: string;
    description?: string;
}

interface RadioGroupProps {
    label: string;
    options: RadioOption[];
    value: string;
    onChange: (value: string) => void;
    layout?: "vertical" | "horizontal";
}

export function RadioGroup({
    label,
    options,
    value,
    onChange,
    layout = "vertical",
}: RadioGroupProps) {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
                {label}
            </label>

            <div
                className={`grid gap-3 ${layout === "horizontal"
                        ? "grid-cols-2 md:grid-cols-3"
                        : "grid-cols-1"
                    }`}
            >
                {options.map((option) => {
                    const isSelected = value === option.value;
                    return (
                        <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-4 rounded-lg border-2 text-left transition-all ${isSelected
                                    ? "border-primary bg-primary/10"
                                    : "border-border/50 hover:border-border bg-secondary/20"
                                }`}
                        >
                            {/* Radio Indicator */}
                            <div className="flex items-start gap-3">
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${isSelected
                                            ? "border-primary bg-primary"
                                            : "border-muted-foreground"
                                        }`}
                                >
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-2 h-2 rounded-full bg-primary-foreground"
                                        />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div
                                        className={`font-medium text-sm ${isSelected ? "text-primary" : "text-foreground"
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

                            {/* Selected Indicator */}
                            {isSelected && (
                                <motion.div
                                    layoutId="radio-indicator"
                                    className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
