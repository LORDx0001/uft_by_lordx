import { useEffect, useRef } from 'react';
import logo from '../../assets/logo_loader.png';

const Loading = ({ fadingOut = false }: { fadingOut?: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let stars: { x: number; y: number; z: number; pz: number }[] = [];
        const starCount = 1200; // Increased density for smoothness
        const speed = 0.08; // High speed by default as requested

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            stars = [];
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * width - width / 2,
                    y: Math.random() * height - height / 2,
                    z: Math.random() * width,
                    pz: 0
                });
            }
        };

        const draw = () => {
            // Fill background
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;

            for (let i = 0; i < starCount; i++) {
                let s = stars[i];

                s.pz = s.z;
                s.z -= speed * 400;

                if (s.z <= 0) {
                    s.z = width;
                    s.pz = s.z;
                    s.x = Math.random() * width - width / 2;
                    s.y = Math.random() * height - height / 2;
                }

                // Project current 3D to 2D
                const x = (s.x / s.z) * width + centerX;
                const y = (s.y / s.z) * width + centerY;

                // Project previous 3D to 2D
                const px = (s.x / s.pz) * width + centerX;
                const py = (s.y / s.pz) * width + centerY;

                const opacity = 1 - s.z / width;
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.lineWidth = opacity * 2.5; // Slightly finer lines for smoothness
                ctx.lineCap = 'round';

                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(x, y);
                ctx.stroke();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleResize = () => {
            init();
        };

        window.addEventListener('resize', handleResize);
        init();
        draw();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className={`fixed inset-0 z-[9999] w-full h-screen overflow-hidden bg-black flex items-center justify-center transition-all duration-1000 ease-in-out ${fadingOut ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />
            <div className="relative z-10 flex flex-col items-center">
                <img
                    src={logo}
                    alt="Loading Logo"
                    className="w-[300px] animate-pulse opacity-90"
                />
            </div>
        </div>
    );
};

export default Loading;