import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    useGSAP(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        if (!cursor || !follower) return;

        const xTo = gsap.quickTo(cursor, "x", { duration: 0.05, ease: "power3" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.05, ease: "power3" });
        const followerXTo = gsap.quickTo(follower, "x", { duration: 0.15, ease: "power3" });
        const followerYTo = gsap.quickTo(follower, "y", { duration: 0.15, ease: "power3" });

        const moveCursor = (e: MouseEvent) => {
            xTo(e.clientX);
            yTo(e.clientY);
            followerXTo(e.clientX);
            followerYTo(e.clientY);
        };

        const handleHoverStart = () => setIsHovering(true);
        const handleHoverEnd = () => setIsHovering(false);

        window.addEventListener('mousemove', moveCursor);

        // Add hover listeners to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"]');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleHoverStart);
            el.addEventListener('mouseleave', handleHoverEnd);
        });

        // Cleanup observer to handle dynamically added elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    const newInteractive = document.querySelectorAll('a, button, input, textarea, [role="button"]');
                    newInteractive.forEach(el => {
                        el.removeEventListener('mouseenter', handleHoverStart); // Remove first to avoid duplicates
                        el.removeEventListener('mouseleave', handleHoverEnd);
                        el.addEventListener('mouseenter', handleHoverStart);
                        el.addEventListener('mouseleave', handleHoverEnd);
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleHoverStart);
                el.removeEventListener('mouseleave', handleHoverEnd);
            });
            observer.disconnect();
        };
    });

    // Animation for hover state
    useEffect(() => {
        if (isHovering) {
            gsap.to(followerRef.current, { scale: 3, opacity: 0.3, duration: 0.15 });
            gsap.to(cursorRef.current, { scale: 0.5, duration: 0.15 });
        } else {
            gsap.to(followerRef.current, { scale: 1, opacity: 0.6, duration: 0.15 });
            gsap.to(cursorRef.current, { scale: 1, duration: 0.15 });
        }
    }, [isHovering]);

    // Hide on touch devices
    if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) {
        return null;
    }

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            />
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-8 h-8 border border-primary rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 opacity-60"
            />
        </>
    );
};
