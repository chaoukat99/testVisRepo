import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoIntroProps {
    onComplete: () => void;
}

export const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const handleFinish = useCallback(() => {
        if (isFadingOut) return;
        setIsFadingOut(true);
        // Short delay then fade out
        setTimeout(() => {
            setIsVisible(false);
            // Mark as seen for this session
            sessionStorage.setItem("videoIntroSeen", "true");
            onComplete();
        }, 600);
    }, [isFadingOut, onComplete]);

    // Auto-play and handle video end
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onEnded = () => handleFinish();
        video.addEventListener("ended", onEnded);

        // Try to autoplay
        video.play().catch(() => {
            // Autoplay blocked – skip the intro
            handleFinish();
        });

        return () => {
            video.removeEventListener("ended", onEnded);
        };
    }, [handleFinish]);

    // Allow skip with Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleFinish();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [handleFinish]);

    // Lock body scroll while intro is visible
    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="video-intro-overlay"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isFadingOut ? 0 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 99999,
                        background: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Video */}
                    <video
                        ref={videoRef}
                        muted
                        playsInline
                        preload="auto"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    >
                        <source src="/vidloader.mp4" type="video/mp4" />
                    </video>

                    {/* Skip button */}
                    <motion.button
                        onClick={handleFinish}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                        style={{
                            position: "absolute",
                            bottom: "40px",
                            right: "40px",
                            background: "rgba(255, 255, 255, 0.12)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "9999px",
                            color: "#fff",
                            padding: "10px 28px",
                            fontSize: "14px",
                            fontWeight: 500,
                            letterSpacing: "0.05em",
                            cursor: "pointer",
                            textTransform: "uppercase",
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
                            e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        Skip ›
                    </motion.button>

                    {/* Subtle progress bar at bottom */}
                    <VideoProgressBar videoRef={videoRef} />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/* ── Tiny progress bar that follows video playback ── */
const VideoProgressBar: React.FC<{
    videoRef: React.RefObject<HTMLVideoElement>;
}> = ({ videoRef }) => {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        const bar = barRef.current;
        if (!video || !bar) return;

        const onTime = () => {
            if (video.duration) {
                const pct = (video.currentTime / video.duration) * 100;
                bar.style.width = `${pct}%`;
            }
        };

        video.addEventListener("timeupdate", onTime);
        return () => video.removeEventListener("timeupdate", onTime);
    }, [videoRef]);

    return (
        <div
            style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "3px",
                background: "rgba(255,255,255,0.1)",
            }}
        >
            <div
                ref={barRef}
                style={{
                    height: "100%",
                    width: "0%",
                    background:
                        "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
                    borderRadius: "0 2px 2px 0",
                    transition: "width 0.25s linear",
                }}
            />
        </div>
    );
};

export default VideoIntro;
