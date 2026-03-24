import { useState } from "react";

interface RangeSliderProps {
    label: string;
    min: number;
    max: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    unit?: string;
    marks?: { value: number; label: string }[];
}

export function RangeSlider({
    label,
    min,
    max,
    step = 1,
    value,
    onChange,
    unit = "",
    marks = [],
}: RangeSliderProps) {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">{label}</label>
                <span className="text-sm font-semibold text-primary">
                    {value} {unit}
                </span>
            </div>

            <div className="relative pt-2 pb-6">
                {/* Slider Track */}
                <div className="relative h-2 bg-secondary/50 rounded-full">
                    {/* Progress */}
                    <div
                        className="absolute h-2 bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                    />

                    {/* Thumb */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-primary rounded-full border-2 border-background shadow-lg transition-all hover:scale-110"
                        style={{ left: `calc(${percentage}% - 10px)` }}
                    />
                </div>

                {/* Input */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {/* Marks */}
                {marks.length > 0 && (
                    <div className="absolute w-full top-8 flex justify-between px-1">
                        {marks.map((mark) => (
                            <span
                                key={mark.value}
                                className="text-xs text-muted-foreground text-center"
                                style={{
                                    position: "absolute",
                                    left: `${((mark.value - min) / (max - min)) * 100}%`,
                                    transform: "translateX(-50%)",
                                }}
                            >
                                {mark.label}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
