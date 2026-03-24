import React from "react";
import { cn } from "@/lib/utils";

interface SectionDividerProps {
    className?: string;
    fill?: string;
    flip?: boolean;
}

export function SectionDivider({ className, fill = "fill-background", flip = false }: SectionDividerProps) {
    return (
        <div className={cn(
            "absolute bottom-0 left-0 w-full overflow-hidden leading-[0]",
            flip ? "transform rotate-0" : "transform rotate-180",
            className
        )}>
            <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className={cn("relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]", fill)}
            >
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.32,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-1.42,1200,34.41V0Z" />
            </svg>
        </div>
    );
}
