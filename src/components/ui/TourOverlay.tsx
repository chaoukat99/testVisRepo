import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '@/store/useOnboardingStore';

export function TourOverlay() {
    const { isTourActive, highlightedElement } = useOnboardingStore();
    const [rect, setRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (!isTourActive || !highlightedElement) {
            setRect(null);
            return;
        }

        const updateRect = () => {
            const el = document.querySelector(highlightedElement);
            if (el) {
                setRect(el.getBoundingClientRect());
            }
        };

        updateRect();
        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect);

        // Also update frequently during transitions if needed, 
        // but scroll/resize usually cover it.
        const interval = setInterval(updateRect, 100);

        return () => {
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect);
            clearInterval(interval);
        };
    }, [isTourActive, highlightedElement]);

    if (!isTourActive) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100000] pointer-events-none"
                style={{
                    backgroundColor: 'rgba(2, 6, 23, 0.4)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    maskImage: rect ? `radial-gradient(circle at ${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px, transparent ${Math.max(rect.width, rect.height) / 2 + 10}px, black ${Math.max(rect.width, rect.height) / 2 + 11}px)` : 'none',
                    WebkitMaskImage: rect ? `radial-gradient(circle at ${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px, transparent ${Math.max(rect.width, rect.height) / 2 + 10}px, black ${Math.max(rect.width, rect.height) / 2 + 11}px)` : 'none',
                }}
            />
        </AnimatePresence>
    );
}
