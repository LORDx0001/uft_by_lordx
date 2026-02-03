import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { apiRequest } from "../../api/apiRequest";
import { useTranslation } from "react-i18next";
import Skeleton from "./Skeleton";

type Portfolio = {
    id: string | number;
    title: string;
    description: string;
    image: string;
    gradient?: string;
    created_at: string;
    updated_at: string;
    link?: string;
};

type PortfolioAbout = {
    id: string;
    title: string;
    description: string;
};

const Portfolio = () => {
    const [currentProject, setCurrentProject] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState("right");
    const { t } = useTranslation()

    const [projects, setProjects] = useState<Portfolio[] | []>([]);
    const [portfolioAbout, setPortfolioAbout] = useState<PortfolioAbout | null>(
        null
    );
    const gradients = [
        "from-sky-600 via-blue-800 to-cyan-800",
        "from-blue-600 via-sky-800 to-sky-900",
        "from-sky-900 via-sky-500 to-blue-500",
    ];
    const current = projects[currentProject];
    const gradient: string = gradients[currentProject % gradients.length];


    const nextProject = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDirection("right");
        setTimeout(() => {
            setCurrentProject((prev) => (prev + 1) % projects.length);
            setIsAnimating(false);
        }, 300);
    };

    const prevProject = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDirection("left");
        setTimeout(() => {
            setCurrentProject((prev) => (prev + 1) % projects.length); // projects.length === 0
            setIsAnimating(false);
        }, 300);
    };

    const goToProject = (index: number) => {
        if (isAnimating || index === currentProject) return;
        setIsAnimating(true);
        setDirection(index > currentProject ? "right" : "left");
        setTimeout(() => {
            setCurrentProject(index);
            setIsAnimating(false);
        }, 300);
    };

    const openProject = (link: string) => {
        window.open(link, "_blank");
    };

    useEffect(() => {
        if (projects.length === 0) return;

        const interval = setInterval(() => {
            nextProject();
        }, 5000);
        return () => clearInterval(interval);
    }, [projects.length]);

    useEffect(() => {
        apiRequest("get", "/portfolio/").then((data) => {
            const parsed = data as Portfolio[];
            setProjects(parsed);
            setCurrentProject(0);
        });
        apiRequest("get", "/portfolio/about/").then((data) => {
            if (Array.isArray(data) && data.length > 0) {
                setPortfolioAbout(data[0] as PortfolioAbout);
            }
        });
    }, []);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: any[] = [];
        const particleCount = 50;

        const resizeCanvas = () => {
            if (canvas) {
                const parent = canvas.parentElement;
                if (parent) {
                    canvas.width = parent.clientWidth;
                    canvas.height = parent.clientHeight;
                } else {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            }
        };

        class Particle {
            x: number; y: number; vx: number; vy: number; size: number;
            constructor() {
                const width = canvas?.width || window.innerWidth;
                const height = canvas?.height || window.innerHeight;
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (canvas) {
                    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                }
            }
            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 242, 255, 0.5)';
                ctx.fill();
            }
        }

        const init = () => {
            resizeCanvas();
            particles = [];
            for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.update();
                p.draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 242, 255, ${0.15 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();
        window.addEventListener('resize', resizeCanvas);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <div
            className="card card-2 w-full min-h-screen bg-[#050510] text-white overflow-hidden relative flex items-center"
        >
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full" />

            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} mix-blend-color-dodge animate-pulse opacity-10`}
                ></div>
                <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.1),transparent_80%)]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-start lg:justify-center w-full px-4 sm:px-6 lg:px-8 pt-[100px] pb-12 lg:pt-[120px] lg:pb-20 min-h-screen">
                <div className="w-full max-w-[90%] mx-auto">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-center text-center lg:text-left mb-6 lg:mb-12 space-y-4 lg:space-y-0">
                        <div className="flex-1 w-full">
                            {portfolioAbout ? (
                                <>
                                    <h1 className="text-4xl md:text-6xl font-bold text-white font-tech mb-4 drop-shadow-[0_0_20px_rgba(0,242,255,0.3)]" data-aos="fade-left">
                                        {portfolioAbout.title}
                                    </h1>
                                    <p className="text-base sm:text-lg lg:text-xl text-blue-100/70 font-outfit max-w-2xl leading-relaxed" data-aos="fade-left" data-aos-delay="200">
                                        {portfolioAbout.description}
                                    </p>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <Skeleton width="60%" height="4rem" className="mx-auto lg:mx-0" />
                                    <Skeleton width="80%" height="1.5rem" variant="text" className="mx-auto lg:mx-0" />
                                </div>
                            )}
                        </div>
                        <div className="flex-shrink-0" data-aos="fade-left">
                            <a href="portfolio/">
                                <button className={`group inline-flex items-center space-x-2 px-6 lg:px-8 py-3 bg-gradient-to-r ${gradient} rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] shadow-lg text-sm sm:text-base`}>
                                    <span className="whitespace-nowrap">{t('viewAllProjects')}</span>
                                    <ExternalLink className="w-4 h-4 sm:w-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </a>
                        </div>
                    </div>

                    {/* Project Showcase */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-8 lg:mb-16">
                        {/* Project Info */}
                        <div className={`transform transition-all duration-500 order-2 lg:order-1 ${isAnimating ? (direction === "right" ? "-translate-x-full" : "translate-x-full") + " opacity-0" : "translate-x-0 opacity-100"}`}>
                            {projects.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-1 h-10 lg:h-16 bg-gradient-to-b ${gradient} rounded-full`}></div>
                                        <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold font-tech text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                            {current?.title}
                                        </h2>
                                    </div>
                                    <p className="text-sm sm:text-base lg:text-xl text-blue-100/60 font-outfit leading-relaxed max-w-xl">
                                        {current?.description}
                                    </p>
                                    <button onClick={() => openProject(current?.link ? current?.link : "")}
                                        className={`group inline-flex items-center space-x-2 px-6 lg:px-8 py-3 bg-gradient-to-r ${gradient} rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] shadow-lg text-sm sm:text-base`}>
                                        <span>{t('viewProject')}</span>
                                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <Skeleton width="70%" height="3rem" />
                                    <div className="space-y-2">
                                        <Skeleton width="100%" height="1rem" variant="text" />
                                        <Skeleton width="100%" height="1rem" variant="text" />
                                        <Skeleton width="60%" height="1rem" variant="text" />
                                    </div>
                                    <Skeleton width="12rem" height="3rem" className="rounded-full" />
                                </div>
                            )}
                        </div>

                        {/* Project Image */}
                        <div className="relative order-1 lg:order-2">
                            <div className={`transform transition-all duration-500 ${isAnimating ? (direction === "right" ? "translate-x-full" : "-translate-x-full") + " opacity-0" : "translate-x-0 opacity-100"}`}>
                                {projects.length > 0 ? (
                                    <div className="relative group cursor-pointer" onClick={() => openProject(current?.link ? current?.link : "")}>
                                        <div className={`absolute -inset-4 bg-gradient-to-r ${gradient} rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                                        <div className="relative bg-black rounded-3xl overflow-hidden border border-white/10 backdrop-blur-sm group-hover:border-cyan-500/50 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" style={{ perspective: '1000px' }}>
                                            <img src={current?.image} alt={current?.title} className="w-full h-48 sm:h-64 lg:h-80 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="text-center">
                                                    <ExternalLink className="w-10 h-10 mx-auto mb-2 text-white" />
                                                    <p className="text-white font-semibold flex items-center justify-center gap-2">View Project</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute -top-6 -right-6 w-12 h-12 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
                                        <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue-500/20 rounded-full blur-lg animate-bounce"></div>
                                    </div>
                                ) : (
                                    <Skeleton width="100%" height="20rem" className="rounded-3xl" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center items-center space-x-6 lg:space-x-10">
                        <button onClick={prevProject} disabled={isAnimating} className="group p-3 lg:p-4 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300 disabled:opacity-50">
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="flex space-x-2">
                            {projects?.map((_, index) => (
                                <button key={index} onClick={() => goToProject(index)} className={`w-10 lg:w-16 h-1.5 rounded-full transition-all duration-300 ${index === currentProject ? `bg-gradient-to-r ${gradient} shadow-[0_0_15px_rgba(0,242,255,0.5)]` : "bg-white/10 hover:bg-white/20"}`} />
                            ))}
                        </div>
                        <button onClick={nextProject} disabled={isAnimating} className="group p-3 lg:p-4 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300 disabled:opacity-50">
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
