import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionDivider } from "@/components/ui/SectionDivider";

gsap.registerPlugin(ScrollTrigger);

export const AntigravitySection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { t } = useLanguage();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles: Particle[] = [];
        const particleCount = 200; // Adjust for density

        // Mouse state
        const mouse = { x: -1000, y: -1000 };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;
            baseX: number;
            baseY: number;
            density: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                // Colors from the image: varying shades of blue/cyan
                const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#1d4ed8', '#ffffff'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.density = (Math.random() * 30) + 1;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                // Mouse interaction (Antigravity repulsion effect)
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = 200; // Interaction radius
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * this.density;
                const directionY = forceDirectionY * force * this.density;

                if (distance < maxDistance) {
                    // Move away from mouse
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    // Return to original position (or just float freely? Let's float freely mostly but drift back to base slightly for structure, or just free float)
                    // Actually, for "antigravity" usually things float. Let's make them float but be pushed by mouse.
                    if (this.x !== this.baseX) {
                        const dxBase = this.x - this.baseX;
                        this.x -= dxBase / 20; // Slow return
                    }
                    if (this.y !== this.baseY) {
                        const dyBase = this.y - this.baseY;
                        this.y -= dyBase / 20;
                    }
                }

                this.draw();
            }
        }

        const init = () => {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => p.update());
            requestAnimationFrame(animate);
        }

        init();
        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Get relative position if canvas is not full screen, but here we assume full width section
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top center",
            }
        });

        tl.from(".antigravity-text", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full h-[80vh] bg-black overflow-hidden flex items-center justify-start pl-10 md:pl-20">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full z-0"
            />

            <div className="relative z-10 max-w-2xl">
                <h2 className="antigravity-text text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    {t('antigravity.title_part1')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                        {t('antigravity.title_highlight')}
                    </span> <br />
                    {t('antigravity.title_part2')}
                </h2>

                <div className="antigravity-text flex flex-wrap gap-4 mt-8">
                    <Button className="rounded-full bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg font-medium transition-transform hover:scale-105">
                        {t('antigravity.btn_x64')}
                    </Button>
                    <Button className="rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 px-8 py-6 text-lg font-medium backdrop-blur-sm transition-transform hover:scale-105">
                        {t('antigravity.btn_arm64')}
                    </Button>
                </div>
            </div>
            <SectionDivider />
        </section>
    );
};
