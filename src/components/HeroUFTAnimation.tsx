import React, { useEffect, useRef } from 'react';
import { useGraphics } from '../contexts/GraphicsContext';

interface HeroUFTAnimationProps {
    imageSrc: string;
}

const HeroUFTAnimation: React.FC<HeroUFTAnimationProps> = ({ imageSrc }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { quality } = useGraphics();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width: number, height: number;
        let particles: Particle[] = [];
        let animationFrameId: number;
        const mouse = { x: -1000, y: -1000, radius: 100 };

        class Particle {
            originX: number;
            originY: number;
            x: number;
            y: number;
            vx: number;
            vy: number;
            ease: number;
            friction: number;

            constructor(point: { x: number; y: number }) {
                this.originX = point.x;
                this.originY = point.y;
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = 0;
                this.vy = 0;
                this.ease = 0.1;
                this.friction = 0.9;
            }

            update() {
                let dx = this.originX - this.x;
                let dy = this.originY - this.y;
                this.vx += dx * this.ease;
                this.vy += dy * this.ease;

                let mdx = mouse.x - this.x;
                let mdy = mouse.y - this.y;
                let mDist = Math.sqrt(mdx * mdx + mdy * mdy);

                if (mDist < mouse.radius) {
                    let force = (mouse.radius - mDist) / mouse.radius;
                    let angle = Math.atan2(mdy, mdx);
                    this.vx -= Math.cos(angle) * force * 40;
                    this.vy -= Math.sin(angle) * force * 40;
                }

                this.vx *= this.friction;
                this.vy *= this.friction;
                this.x += this.vx;
                this.y += this.vy;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(this.x, this.y, 2, 2);
            }
        }

        const setup = () => {
            const container = canvas.parentElement;
            if (!container) return;

            width = container.clientWidth;
            height = container.clientHeight;
            canvas.width = width;
            canvas.height = height;

            const tempCanvas = document.createElement('canvas');
            const tctx = tempCanvas.getContext('2d');
            if (!tctx) return;

            tempCanvas.width = width;
            tempCanvas.height = height;

            if (!imageSrc) {
                console.error('HeroUFTAnimation: imageSrc is required');
                return;
            }

            // Load and draw image
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                // Calculate scaling to fit container
                const scale = Math.min(width / img.width, height / img.height) * 0.8;
                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;
                const x = (width - scaledWidth) / 2;
                const y = (height - scaledHeight) / 2;

                tctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                processImageData(tctx);
            };
            img.onerror = () => {
                console.error('Failed to load image:', imageSrc);
            };
            img.src = imageSrc;
        };

        const processImageData = (tctx: CanvasRenderingContext2D) => {
            const imgData = tctx.getImageData(0, 0, width, height).data;
            const textPoints = [];

            // Quality-based sampling
            const step = quality === 'low' ? 16 : quality === 'medium' ? 8 : 4;

            for (let y = 0; y < height; y += step) {
                for (let x = 0; x < width; x += step) {
                    if (imgData[(y * width + x) * 4 + 3] > 128) {
                        textPoints.push({ x, y });
                    }
                }
            }

            particles = textPoints.map(point => new Particle(point));
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Disable lines on low quality for performance
                if (quality !== 'low') {
                    const lineLimit = 3;
                    for (let j = i + 1; j < Math.min(i + lineLimit, particles.length); j++) {
                        let dx = particles[i].x - particles[j].x;
                        let dy = particles[i].y - particles[j].y;
                        let dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 30) {
                            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 30})`;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleTouchMove = (e: TouchEvent) => {
            // Safety check for touches
            if (e.touches && e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.touches[0].clientX - rect.left;
                mouse.y = e.touches[0].clientY - rect.top;
            }
        };

        // Debounce resize to prevent freeze during window adjust
        let resizeTimeout: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                setup();
            }, 200);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        setup();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(resizeTimeout);
        };
    }, [quality]);

    return (
        <div className="w-full h-full min-h-[300px] flex items-center justify-center overflow-visible">
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    );
};

export default HeroUFTAnimation;
