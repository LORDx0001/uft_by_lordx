import React, { useEffect, useRef } from 'react';
import { useGraphics } from '../contexts/GraphicsContext';

const HeroAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { quality } = useGraphics();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;
        const charSize = 14;

        interface ChainNode {
            x: number;
            y: number;
            oldX: number;
            oldY: number;
            char: string;
        }

        interface Stream {
            nodes: ChainNode[];
            opacity: number;
            speed: number;
            alive: boolean;
        }

        let streams: Stream[] = [];

        let mouse = { x: -1000, y: -1000, radius: 80 };

        const createStream = (xPos?: number): Stream => {
            const length = Math.floor(Math.random() * 15 + 10);
            const x = xPos ?? Math.random() * width;
            const y = Math.random() * -height; // Start at random height above screen
            const nodes: ChainNode[] = [];

            for (let i = 0; i < length; i++) {
                const yPos = y - i * charSize;
                nodes.push({
                    x: x,
                    y: yPos,
                    oldX: x,
                    oldY: yPos,
                    char: Math.random() > 0.5 ? '1' : '0'
                });
            }

            return {
                nodes,
                opacity: Math.random() * 0.5 + 0.2,
                speed: Math.random() * 0.05 + 0.05, // Glacial falling speed
                alive: true
            };
        };

        const createStreams = () => {
            streams = [];
            // Quality-based stream density
            const spacing = quality === 'low' ? 25 : quality === 'medium' ? 18 : 15;
            const count = Math.ceil(width / spacing);
            for (let i = 0; i < count; i++) {
                streams.push(createStream(i * spacing + Math.random() * 8));
            }
        };

        const gravity = 0.005; // Glacial gravity
        const friction = 0.98;
        const spacing = charSize;

        const updateStream = (stream: Stream) => {
            // 1. Verlet Integration (Movement)
            stream.nodes.forEach((node) => {
                const vx = (node.x - node.oldX) * friction;
                const vy = (node.y - node.oldY) * friction;

                node.oldX = node.x;
                node.oldY = node.y;

                node.x += vx;
                node.y += vy;

                // Falling speed (cmatrix style)
                node.y += stream.speed;

                // Gravity (slight pull for physics feel)
                node.y += gravity;

                // Mouse Interaction
                const dx = node.x - mouse.x;
                const dy = node.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    node.x += Math.cos(angle) * force * 5;
                    node.y += Math.sin(angle) * force * 5;
                }
            });

            for (let iterations = 0; iterations < 3; iterations++) {
                for (let i = 0; i < stream.nodes.length - 1; i++) {
                    const n1 = stream.nodes[i];
                    const nextNode = stream.nodes[i + 1];

                    const dx = nextNode.x - n1.x;
                    const dy = nextNode.y - n1.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist === 0) continue; // Prevent division by zero
                    const diff = spacing - dist;
                    const percent = (diff / dist) / 2;
                    const offsetX = dx * percent;
                    const offsetY = dy * percent;

                    n1.x -= offsetX;
                    n1.y -= offsetY;
                    nextNode.x += offsetX;
                    nextNode.y += offsetY;
                }
            }

            // Reset logic
            const tail = stream.nodes[stream.nodes.length - 1];

            // If the entire chain has passed the bottom
            if (tail.y > height + 100) {
                const newStream = createStream();
                stream.nodes = newStream.nodes;
                stream.opacity = newStream.opacity;
                stream.speed = newStream.speed;
            }
        };

        const drawStream = (stream: Stream) => {
            if (!ctx) return;

            stream.nodes.forEach((node, i) => {
                if (node.y > height + 20 || node.y < -50) return;

                const isHead = i === 0;
                const alpha = isHead ? 1 : (stream.opacity * (1 - i / stream.nodes.length));

                ctx.fillStyle = isHead ? '#ffffff' : '#0ea5e9';
                ctx.globalAlpha = alpha;

                // Occasional character flicker
                if (Math.random() > 0.99) {
                    node.char = Math.random() > 0.5 ? '1' : '0';
                }

                ctx.font = `${isHead ? charSize + 2 : charSize}px monospace`;
                ctx.fillText(node.char, node.x, node.y);
            });
            ctx.globalAlpha = 1;
        };

        const animate = () => {
            if (!ctx) return;

            // Clear frame with trail effect (optional, currently solid)
            ctx.fillStyle = '#050a1f';
            ctx.fillRect(0, 0, width, height);

            streams.forEach(stream => {
                updateStream(stream);
                drawStream(stream);
            });

            // Draw Mouse interaction glow (subtle)
            if (mouse.x > 0) {
                const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius);
                gradient.addColorStop(0, 'rgba(14, 165, 233, 0.15)'); // Light blue glow
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(mouse.x - mouse.radius, mouse.y - mouse.radius, mouse.radius * 2, mouse.radius * 2);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            createStreams();
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        canvas.width = width;
        canvas.height = height;
        createStreams();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [quality]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ background: '#050a1f' }}
        />
    );
};

export default HeroAnimation;
