import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiRequest } from "../../api/apiRequest";
import toast from "react-hot-toast";
import HeroAnimation from "./HeroAnimation";
import HeroUFTAnimation from "./HeroUFTAnimation";
import Skeleton from "./Skeleton";
import logoWhite from "../../assets/logo-white.png";

type BannerType = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};

const Hero = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { t } = useTranslation();
  const [isSticky, setIsSticky] = useState(true);

  const [apiData, setApiData] = useState<BannerType[] | []>([]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const textRef = useRef<HTMLDivElement | null>(null);
  const text = "scroll down for work together ";

  useEffect(() => {
    const container = textRef.current;
    if (container) {
      const radius = 70; // Distance from center

      for (let i = 0; i < text.length; i++) {
        const span = document.createElement("span");
        span.innerText = text[i];
        span.className = "absolute text-white text-sm font-medium";

        // Calculate angle for each character
        const angle = (360 / text.length) * i;
        const radian = (angle - 90) * (Math.PI / 180); // -90 to start from top

        // Calculate position using trigonometry
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;

        // Position and rotate each character
        span.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
        span.style.transformOrigin = "center";

        container.appendChild(span);
      }
    }
  }, []);

  // Handle mouse movement for button glow effect
  const handleMouseMove = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!buttonRef.current || !glowRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const buttonX = e.clientX - buttonRect.left;
    const buttonY = e.clientY - buttonRect.top;

    glowRef.current.style.left = `${buttonX}px`;
    glowRef.current.style.top = `${buttonY}px`;
  };

  // button items
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const glowRef = useRef<HTMLSpanElement | null>(null);
  // end button items

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY < 900);
    };

    handleScroll(); // Initial check

    window.addEventListener("scroll", handleScroll); // ✅ Listen to scroll instead of resize

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    apiRequest("get", "/client/banner")
      .then((data) => setApiData(data as BannerType[]))
      .catch(() => toast.error("Something went wrong!"));
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className={`relative min-h-screen flex items-center overflow-hidden z-0 ${isSticky ? "sticky" : ""}`}
    >
      {/* Hero Animation Background */}
      <HeroAnimation />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 min-h-[calc(100vh-80px)] md:min-h-0">
        <div className="flex flex-col text-left md:text-left max-w-2xl pb-10 md:pb-0 relative z-20 w-full md:w-1/3 md:ml-20 animate-fade-in-up">
          <h1 className="font-bold text-white mb-6 leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw + 1rem, 4rem)' }}>
            <span
              className="block font-montserrat animate-slide-in-left"
              style={{ animationDelay: "0.2s" }}
            >
              {apiData.length > 0 ? apiData[0]?.title : (
                <Skeleton width="80%" height="4rem" className="mb-4" />
              )}
            </span>
          </h1>

          <div
            className="text-white mb-10 max-w-xl leading-relaxed animate-fade-in-up"
            style={{
              animationDelay: "0.6s",
              fontSize: 'clamp(1.1rem, 1.5vw + 0.5rem, 1.5rem)'
            }}
          >
            {apiData.length > 0 ? apiData[0]?.description : (
              <div className="space-y-2">
                <Skeleton width="100%" height="1.2rem" variant="text" />
                <Skeleton width="90%" height="1.2rem" variant="text" />
                <Skeleton width="40%" height="1.2rem" variant="text" />
              </div>
            )}
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            {/* button start*/}
            <button
              onClick={() => scrollToSection("contact")}
              className="custom-button w-fit group inline-flex items-center px-10 py-5 text-lg font-medium text-black bg-white rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative overflow-hidden cursor-pointer z-10"
              ref={buttonRef}
              onMouseMove={handleMouseMove}
            >
              <h3 className="text-xl font-medium bg-gradient-to-r from-blue-400 via-sky-500 via-sky-900 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
                {t("submitRequest")}
              </h3>
              <ArrowRight
                className="ml-3 group-hover:translate-x-1 transition-transform duration-200 text-gray-700"
                size={24}
              />
              <span
                className="glow absolute w-48 h-48 bg-gradient-radial from-blue-500/30 to-transparent rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                ref={glowRef}
                style={{ transform: "translate(-50%, -50%)" }}
              ></span>
            </button>
          </div>
        </div>

        <div className="hidden md:flex md:w-2/3 justify-end items-center animate-fade-in-up z-10 pointer-events-none md:pointer-events-auto -mr-20" style={{ animationDelay: "0.4s" }}>
          <div className="w-full h-[600px]">
            <HeroUFTAnimation imageSrc={logoWhite} />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </section >
  );
};

export default Hero;
