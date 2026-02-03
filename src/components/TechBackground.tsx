import React, { useEffect, useRef } from 'react';

const TechBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let hexNodes: HexNode[] = [];
        const particleCount = 70;
        const connectionDistance = 180;
        const mouse = { x: -1000, y: -1000, radius: 250, active: false };

        const colors = ['#00ffff', '#00d4ff', '#00ffaa', '#6a00ff'];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;
            glowColor: string;

            constructor(width: number, height: number) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.2;
                this.vy = (Math.random() - 0.5) * 1.2;
                this.size = Math.random() * 3 + 1.5;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.glowColor = this.color;
            }

            update(width: number, height: number) {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse/Touch reaction
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 4;
                    this.y += (dy / dist) * force * 4;
                    this.size = (Math.random() * 3 + 1.5) * (1 + force);
                } else {
                    this.size = this.size * 0.99 + (Math.random() * 3 + 1.5) * 0.01;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.glowColor;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        class HexNode {
            x: number;
            y: number;
            size: number;
            opacity: number;
            targetOpacity: number;

            constructor(x: number, y: number, size: number) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.opacity = 0;
                this.targetOpacity = Math.random() * 0.2;
            }

            draw() {
                if (!ctx) return;
                this.opacity += (this.targetOpacity - this.opacity) * 0.02;
                if (Math.abs(this.opacity - this.targetOpacity) < 0.001) {
                    this.targetOpacity = Math.random() * 0.2;
                }

                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const extraOpacity = dist < mouse.radius ? (1 - dist / mouse.radius) * 0.4 : 0;

                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i;
                    const px = this.x + this.size * Math.cos(angle);
                    const py = this.y + this.size * Math.sin(angle);
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.strokeStyle = `rgba(0, 255, 255, ${this.opacity + extraOpacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        const init = () => {
            const parent = canvas.parentElement;
            const width = parent ? parent.clientWidth : window.innerWidth;
            const height = parent ? parent.clientHeight : window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(width, height));
            }

            hexNodes = [];
            const hexSize = 70;
            const xSpacing = hexSize * 1.5;
            const ySpacing = hexSize * Math.sqrt(3) * 0.5;

            for (let y = -hexSize; y < height + hexSize; y += ySpacing) {
                for (let x = -hexSize; x < width + hexSize; x += xSpacing) {
                    const xPos = x + ((Math.floor(y / ySpacing) % 2) * xSpacing * 0.5);
                    hexNodes.push(new HexNode(xPos, y, hexSize * 0.8));
                }
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.fillStyle = '#020208';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            hexNodes.forEach(node => node.draw());

            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.update(canvas.width, canvas.height);
                p1.draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        const alpha = (1 - distance / connectionDistance) * 0.8;
                        ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleInput = (x: number, y: number) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = x - rect.left;
            mouse.y = y - rect.top;
            mouse.active = true;
        };

        const handleMouseMove = (e: MouseEvent) => handleInput(e.clientX, e.clientY);
        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                handleInput(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        const handleStop = () => {
            mouse.x = -1000;
            mouse.y = -1000;
            mouse.active = false;
        };

        const resizeObserver = new ResizeObserver(() => {
            init();
        });

        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleStop);
        window.addEventListener('touchstart', (e) => handleTouchMove(e));
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleStop);

        init();
        animate();

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleStop);
            window.removeEventListener('touchstart', handleTouchMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleStop);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
    );
};

export default TechBackground;
