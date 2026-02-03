import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../api/apiRequest";

gsap.registerPlugin(ScrollTrigger);

type Partners = {
  id: number;
  image: string;
};

function ScrollingLogos({ className }: { className?: string }) {
  const [partners, setPartners] = useState<Partners[]>([]);
  const backgroundRef = useRef(null);

  // Ikki marta takrorlab, seamless scroll hosil qilamiz
  const duplicatedPartners = [...partners, ...partners];

  useEffect(() => {
    apiRequest<Partners[]>("get", "/partners/")
      .then((data) => setPartners(data))
      .catch(() => toast.error("Something went wrong!"));
  }, []);

  useEffect(() => {
    const element = backgroundRef.current;

    if (element) {
      ScrollTrigger.create({
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const skewAmount = (self.progress - 0.5) * 8;
          gsap.set(element, {
            skewY: skewAmount,
            transformOrigin: "center center",
          });
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      className={`bg-black/30 backdrop-blur-sm w-full border-t border-white/5 ${className}`}
    >
      <div className="relative z-10 h-[120px] lg:h-[140px] overflow-hidden flex items-center">
        {/* Logos */}
        <div
          className="flex animate-scroll"
          style={{
            width: `${duplicatedPartners.length * 260}px`, // kattaroq rasm uchun kenglik
            animation: "scroll 20s linear infinite", // ⚡ Tezroq aylanish (40s -> 20s)
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex-shrink-0 w-60 h-32 flex items-center justify-center mx-4 p-4  transition-transform duration-300 hover:scale-110 "
            >
              <img
                src={partner.image}
                alt={`partner-${partner.id}`}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Skew animatsiya elementi */}
      <div className="absolute inset-0">
        <div
          ref={backgroundRef}
          className="w-full h-32 top-0"
          style={{
            transformOrigin: "center center",
          }}
        ></div>
      </div>

      {/* Scroll CSS animatsiya */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${partners.length * 260}px);
          }
        }
      `}</style>
    </div>
  );
}

export default ScrollingLogos;
