import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = false,
  hover = true,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "glass-card p-6",
        glow && "glow-border",
        hover && "hover-lift",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
