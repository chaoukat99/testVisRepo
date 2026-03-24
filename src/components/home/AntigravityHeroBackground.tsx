import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { motion } from 'framer-motion';

export const AntigravityHeroBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const isDark = theme === 'dark';

        // Constellation Particles
        class Particle {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            size: number;
            vx: number;
            vy: number;
            density: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = Math.random() * 1.5 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.density = (Math.random() * 30) + 1;
            }

            update() {
                // Return to base position or float
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                const dx = mouseRef.current.x - this.x;
                const dy = mouseRef.current.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = 150;
                const force = (maxDistance - distance) / maxDistance;

                if (distance < maxDistance) {
                    this.x -= forceDirectionX * force * this.density * 0.5;
                    this.y -= forceDirectionY * force * this.density * 0.5;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = isDark ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.2)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        let particles: Particle[] = [];
        const initParticles = () => {
            const particleCount = Math.floor((width * height) / 15000);
            particles = Array.from({ length: particleCount }, () => new Particle());
        };

        initParticles();

        // Fluid blobs logic remains but refined
        class FluidBlob {
            x: number;
            y: number;
            size: number;
            color: string;
            vx: number;
            vy: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 600 + 400;
                const colors = isDark
                    ? ['rgba(6, 182, 212, 0.12)', 'rgba(124, 58, 237, 0.12)', 'rgba(30, 64, 175, 0.08)']
                    : ['rgba(6, 182, 212, 0.05)', 'rgba(168, 85, 247, 0.05)', 'rgba(59, 130, 246, 0.03)'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = (Math.random() - 0.5) * 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < -this.size) this.x = width + this.size;
                if (this.x > width + this.size) this.x = -this.size;
                if (this.y < -this.size) this.y = height + this.size;
                if (this.y > height + this.size) this.y = -this.size;
            }

            draw() {
                if (!ctx) return;
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            }
        }

        const blobs: FluidBlob[] = Array.from({ length: 3 }, () => new FluidBlob());

        const connect = () => {
            if (!ctx) return;
            const maxDistance = 150;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = 1 - (distance / maxDistance);
                        ctx.strokeStyle = isDark
                            ? `rgba(168, 85, 247, ${opacity * 0.15})`
                            : `rgba(168, 85, 247, ${opacity * 0.1})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('mousemove', handleMouseMove);

        let animationFrameId: number;
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            ctx.globalCompositeOperation = 'screen';
            blobs.forEach(blob => {
                blob.update();
                blob.draw();
            });

            ctx.globalCompositeOperation = 'source-over';
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connect();

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 bg-background overflow-hidden preserve-3d">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-80"
            />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05] dark:opacity-[0.1] pointer-events-none" />

            {/* Ambient Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.05),transparent_70%)]" />

            {/* Moving Light Rays */}
            <motion.div
                animate={{
                    rotate: [0, 5, 0],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[50%] -left-[10%] w-[120%] h-[120%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(168,85,247,0.03)_180deg,transparent_360deg)] pointer-events-none"
            />

            {/* Top and Bottom Vignette */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
        </div>
    );
};
