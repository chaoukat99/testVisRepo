import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
    className?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "hero";
    animate?: boolean;
}

export function Logo({ className, size = "md", animate = true }: LogoProps) {
    const sizes = {
        xs: "h-6 sm:h-8",
        sm: "h-10 sm:h-14",
        md: "h-16 sm:h-24",
        lg: "h-20 sm:h-28",
        xl: "h-32 sm:h-48",
        hero: "h-48 sm:h-64",
    };

    const content = (
        <>
            <img
                src="/images/circleLogo.png"
                alt="OpenIn Partners"
                style={{ border: "none", backgroundColor: "transparent" }}
                className={cn(
                    "w-auto object-contain brightness-110 transition-all duration-300 sm:hidden",
                    "dark:invert-0 light:invert",
                    sizes[size],
                    className
                )}
            />
            <img
                src="/images/LogoMetal22.png"
                alt="OpenIn Partners"
                style={{ border: "none", backgroundColor: "transparent" , marginTop: "3px"}}
                className={cn(
                    "w-auto object-contain brightness-110 transition-all duration-300 hidden sm:block",
                    "dark:invert-0 light:invert",
                    sizes[size],
                    className
                )}
            />
        </>
    );

    if (animate) {
        return (
            <motion.div
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex items-center justify-center"
            >
                {content}
            </motion.div>
        );
    }

    return <div className="flex items-center justify-center">{content}</div>;
}
