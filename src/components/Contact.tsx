import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiRequest } from "../../api/apiRequest";
import { toast } from "react-hot-toast";

type WhyChooseUsType = {
    id: string;
    value: string;
};

type ContactInfoType = {
    title: string;
    description: string;
    media: string;
};

type FormValues = {
    first_name: string;
    last_name: string;
    email: string;
    company: string;
    phone_number: string;
    project_details: string;
};

const Contact = () => {
    const { t } = useTranslation();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsType[]>([]);
    const [contactInfo, setContactInfo] = useState<ContactInfoType[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<FormValues>();

    const onSubmit = (data: FormValues) => {
        const phone_number =
            data?.phone_number[0] === "+"
                ? data?.phone_number
                : "+" + data?.phone_number;
        apiRequest("post", "/contact/", { ...data, phone_number: phone_number })
            .then(() => {
                setIsSubmitted(true);
                reset();
                toast.success(t("messageSent"));
            })
            .catch((e) => {
                const errorData = e.response?.data;
                if (errorData) {
                    for (const key in errorData) {
                        toast.error(errorData[key][0]);
                    }
                } else {
                    toast.error("Something went wrong!");
                }
            });

        setTimeout(() => setIsSubmitted(false), 3000);
    };

    useEffect(() => {
        apiRequest("get", "/contact/why-choose-us/")
            .then((data) => setWhyChooseUs(data as WhyChooseUsType[]))
            .catch(() => { });

        apiRequest("get", "/contact/contact-info/")
            .then((data) => setContactInfo(data as ContactInfoType[]))
            .catch(() => { });
    }, []);

    // Interactive Mesh Background (Light Theme Adjusted)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        const mouse = { x: -1000, y: -1000, radius: 250 };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        // Use a stable reference for dimensions
        const getCanvasWidth = () => canvas.width;
        const getCanvasHeight = () => canvas.height;

        class Shape {
            x: number; y: number; size: number; rotation: number; rotationSpeed: number;
            vx: number; vy: number; type: 'triangle';
            color: string;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 20 + 15;
                this.rotation = Math.random() * Math.PI * 2;
                // Much slower, smoother rotation
                this.rotationSpeed = (Math.random() - 0.5) * 0.015;
                // Slower upward drift
                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = -Math.random() * 0.5 - 0.3;
                this.type = 'triangle';

                // Site-inspired blue palette
                const colors = [
                    "rgba(16, 71, 110, 0.5)", // Darker brand blue
                    "rgba(36, 137, 181, 0.5)", // Lighter brand blue
                    "rgba(14, 165, 233, 0.5)"  // Sky blue depth
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1.5;

                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.lineTo(-this.size / 2, this.size / 2);
                ctx.closePath();
                ctx.stroke();

                // Soft glow fill
                ctx.fillStyle = this.color.replace('0.5', '0.12');
                ctx.fill();

                ctx.restore();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;

                const cw = getCanvasWidth();
                const ch = getCanvasHeight();

                // Smooth Wrap around
                if (this.y < -this.size) {
                    this.y = ch + this.size;
                    this.x = Math.random() * cw;
                }
                if (this.x < -this.size) this.x = cw + this.size;
                if (this.x > cw + this.size) this.x = -this.size;

                // Gentle repulsion
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    const force = (200 - dist) / 200;
                    this.vx -= (dx / dist) * force * 0.8;
                    this.vy -= (dy / dist) * force * 0.8;
                }
            }
        }

        let shapes: Shape[] = [];
        const init = () => {
            shapes = [];
            const cw = getCanvasWidth();
            const ch = getCanvasHeight();
            const numberOfShapes = (cw * ch) / 18000;
            for (let i = 0; i < numberOfShapes; i++) {
                shapes.push(new Shape(Math.random() * cw, Math.random() * ch));
            }
        };

        const animate = () => {
            const cw = getCanvasWidth();
            const ch = getCanvasHeight();
            ctx.clearRect(0, 0, cw, ch);
            shapes.forEach(shape => {
                shape.update();
                shape.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("mousemove", handleMouseMove);

        resizeCanvas();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <section
            id="contact"
            className="relative min-h-[90vh] z-30 bg-white flex flex-col items-center justify-center py-16 overflow-hidden"
        >
            {/* Minimalist Background Elements */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-50" />

            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none translate-x-[20%] -translate-y-[20%]"></div>
            <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-50/50 rounded-full blur-[100px] pointer-events-none -translate-x-[20%] translate-y-[20%]"></div>

            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left Column: Clean Typography & Modern Grid */}
                    <div className="space-y-10" data-aos="fade-right">
                        <div>
                            <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-1.5 rounded-full text-blue-600 text-sm font-semibold tracking-wide uppercase mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                <span>{t("contactUs") || "Contact Us"}</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                                {contactInfo[0]?.title || "Let's build something"}
                            </h2>
                            <p className="text-lg text-gray-500 leading-relaxed font-outfit max-w-lg">
                                {contactInfo[0]?.description}
                            </p>
                        </div>

                        {/* Modernized Feature Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {whyChooseUs.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300"
                                    data-aos="fade-up"
                                    data-aos-delay={100 + index * 50}
                                >
                                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                                        <CheckCircle size={20} />
                                    </div>
                                    <span className="font-medium text-gray-700 text-sm">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: The "Floating Island" Form */}
                    <div
                        className="relative w-full max-w-md mx-auto lg:mr-0"
                        data-aos="fade-left"
                        data-aos-delay="200"
                    >
                        {/* Decorative blob behind form */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-full blur-3xl -z-10"></div>

                        <div className="relative bg-white rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100/50 p-8 overflow-hidden">
                            {/* Top Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 pl-1">{t("firstName")}</label>
                                        <input
                                            {...register("first_name", { required: true })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-gray-900 outline-none transition-all duration-200 text-sm font-medium placeholder:text-gray-400"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 pl-1">{t("secondName")}</label>
                                        <input
                                            {...register("last_name", { required: true })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-gray-900 outline-none transition-all duration-200 text-sm font-medium placeholder:text-gray-400"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 pl-1">{t("email")}</label>
                                    <input
                                        type="email"
                                        {...register("email", { required: true })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-gray-900 outline-none transition-all duration-200 text-sm font-medium placeholder:text-gray-400"
                                        placeholder="john@company.com"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 pl-1">{t("phone")}</label>
                                    <input
                                        type="tel"
                                        {...register("phone_number", { required: true })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-gray-900 outline-none transition-all duration-200 text-sm font-medium placeholder:text-gray-400"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 pl-1">{t("projectDetails")}</label>
                                    <textarea
                                        {...register("project_details", { required: true })}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-gray-900 outline-none transition-all duration-200 text-sm font-medium resize-none placeholder:text-gray-400"
                                        placeholder={t("tellUsAboutProject")}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitted}
                                    className={`w-full group mt-2 flex items-center justify-center py-4 px-6 rounded-xl font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm ${isSubmitted ? "bg-green-500" : "bg-gray-900 hover:bg-black"
                                        }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        {isSubmitted ? (
                                            <>
                                                <CheckCircle size={20} className="animate-bounce" />
                                                <span className="text-sm">{t("messageSent")}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-sm tracking-wide uppercase">{t("sendMessage")}</span>
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </div>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
