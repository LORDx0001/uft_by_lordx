import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HoverEffect } from "./card-hover-effects/card-hover-effects";
import { apiRequest } from "../../api/apiRequest";
import Skeleton from "./Skeleton";

gsap.registerPlugin(ScrollTrigger);

export type Tool = {
  id: string;
  name: string;
  image: string;
};

export type Technologies = {
  id: number;
  title: string;
  description: string;
  tool: Tool[];
};

const Technologies = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [technologies, setTechnologies] = useState<Technologies | null>(null);

  useEffect(() => {
    apiRequest("get", "/tools/")
      .then((data) => setTechnologies(data as Technologies))
      .catch(alert);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const mouse = { x: -1000, y: -1000, radius: 180 };

    const resizeCanvas = () => {
      if (canvas) {
        const parent = canvas.parentElement;
        canvas.width = parent ? parent.clientWidth : window.innerWidth;
        canvas.height = parent ? parent.clientHeight : window.innerHeight;
        init();
      }
    };

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      size: number;
      density: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2.5 + 1;
        this.density = Math.random() * 35 + 5;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = "rgba(30, 64, 175, 0.6)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        // Add a subtle glow to some particles
        if (this.size > 3) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(30, 64, 175, 0.7)";
        } else {
          ctx.shadowBlur = 0;
        }
      }

      update() {
        // Continuous movement
        this.baseX += this.vx;
        this.baseY += this.vy;

        // Wrap around boundaries
        const width = canvas?.width || window.innerWidth;
        const height = canvas?.height || window.innerHeight;
        if (this.baseX < -50) this.baseX = width + 50;
        if (this.baseX > width + 50) this.baseX = -50;
        if (this.baseY < -50) this.baseY = height + 50;
        if (this.baseY > height + 50) this.baseY = -50;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = (dx / distance) * force * this.density;
          let directionY = (dy / distance) * force * this.density;

          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 15;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 15;
          }
        }
      }
    }

    const init = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 10000;
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    const connect = () => {
      if (!ctx) return;
      ctx.shadowBlur = 0;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            let opacityValue = 1 - distance / 150;
            ctx.strokeStyle = `rgba(30, 64, 175, ${opacityValue * 0.4})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (sectionRef.current) {
      resizeObserver.observe(sectionRef.current);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <section
      id="tools"
      ref={sectionRef}
      className="relative min-h-screen py-32 flex flex-col items-center justify-start overflow-hidden transition-all duration-1000 bg-white"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* High-tech grid overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.08]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,114,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(0,114,255,0.3)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]"></div>
      </div>

      {!technologies ? (
        <div className="relative z-10 w-full max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-start mb-16">
            <Skeleton width="60%" height="4rem" className="mb-6" mode="light" />
            <div className="flex items-center space-x-4">
              <Skeleton width="8rem" height="1.5rem" variant="rectangle" mode="light" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} height="12rem" mode="light" />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-start mb-16" data-aos="fade-right">
            <h2
              className="text-4xl lg:text-7xl font-bold font-tech text-gray-900 mb-6 tracking-tight drop-shadow-sm"
              style={{ perspective: "1000px" }}
            >
              {technologies?.title}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full shadow-lg"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping"></div>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            {technologies?.tool && <HoverEffect items={technologies?.tool} />}
          </div>
        </div>
      )}
    </section>
  );
};

export default Technologies;
