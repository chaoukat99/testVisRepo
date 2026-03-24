import { useState } from "react";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TagsInputProps {
    label: string;
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    suggestions?: string[];
    placeholder?: string;
    maxTags?: number;
}

export function TagsInput({
    label,
    tags,
    onTagsChange,
    suggestions = [],
    placeholder = "Add a tag...",
    maxTags,
}: TagsInputProps) {
    const [input, setInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredSuggestions = suggestions.filter(
        (s) =>
            !tags.includes(s) &&
            s.toLowerCase().includes(input.toLowerCase())
    );

    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (trimmed && !tags.includes(trimmed) && (!maxTags || tags.length < maxTags)) {
            onTagsChange([...tags, trimmed]);
            setInput("");
            setShowSuggestions(false);
        }
    };

    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter((t) => t !== tagToRemove));
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
                {label}
                {maxTags && (
                    <span className="text-xs text-muted-foreground ml-2">
                        ({tags.length}/{maxTags})
                    </span>
                )}
            </label>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 min-h-[40px]">
                <AnimatePresence>
                    {tags.map((tag) => (
                        <motion.span
                            key={tag}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-destructive transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>

            {/* Input */}
            <div className="relative">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addTag(input);
                            }
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder={placeholder}
                        className="futuristic-input flex-1"
                    />
                    <button
                        type="button"
                        onClick={() => addTag(input)}
                        className="px-4 py-2 rounded-lg bg-secondary/50 text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add</span>
                    </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-10 w-full mt-2 glass-card p-2 max-h-48 overflow-y-auto"
                    >
                        {filteredSuggestions.slice(0, 10).map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => addTag(suggestion)}
                                className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-secondary/50 transition-colors"
                            >
                                + {suggestion}
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Popular Suggestions */}
            {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {suggestions
                        .filter((s) => !tags.includes(s))
                        .slice(0, 20)
                        .map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => addTag(suggestion)}
                                className="px-3 py-1.5 rounded-lg text-xs bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            >
                                + {suggestion}
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
}
