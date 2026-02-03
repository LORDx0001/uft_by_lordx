import React, { useEffect, useRef } from 'react';

const HeroUFTAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
                this.ease = 0.1; // More responsive
                this.friction = 0.9; // Less drag, smoother 'slide'
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

            tctx.fillStyle = 'white';
            tctx.textAlign = 'center';
            tctx.textBaseline = 'middle';
            // Adjusted size for Hero section
            const fontSize = Math.min(width, height) * 0.6;
            tctx.font = `bold ${fontSize}px Impact, sans-serif`;
            tctx.fillText('UFT', width / 2, height / 2);

            const imgData = tctx.getImageData(0, 0, width, height).data;
            const textPoints = [];

            // Step size 6 for better performance in React environment
            for (let y = 0; y < height; y += 6) {
                for (let x = 0; x < width; x += 6) {
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

                // Draw lines between nearby particles
                for (let j = i + 1; j < Math.min(i + 5, particles.length); j++) {
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
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.touches[0].clientX - rect.left;
                mouse.y = e.touches[0].clientY - rect.top;
            }
        };

        const handleResize = () => {
            setup();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);

        setup();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="w-full h-full min-h-[300px] flex items-center justify-center overflow-visible">
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    );
};

export default HeroUFTAnimation;
