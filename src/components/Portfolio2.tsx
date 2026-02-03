import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import Services from "./Services";
import Portfolio from "./Portfolio";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const AnimatedPanel = ({
  id,
  className,
  children,
  isDesktop,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  isDesktop: boolean;
}) => (
  <section
    id={`${id}`}
    className={`
            ${isDesktop
        ? "panel min-w-[100vw] h-screen flex items-center justify-center absolute top-0 left-0"
        : "w-full min-h-screen flex items-center justify-center"
      } 
            ${className}
        `}
    style={isDesktop ? { transformStyle: "preserve-3d", backfaceVisibility: "hidden" } : {}}
  >
    {children}
  </section>
);

const Portfolio2 = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const checkIsDesktop = () => window.innerWidth >= 1024;

  useEffect(() => {
    const handleResize = () => setIsDesktop(checkIsDesktop());
    setIsDesktop(checkIsDesktop());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !panelsRef.current || !isDesktop) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".panel");

      // Set initial positions for desktop
      gsap.set(panels[1], { xPercent: 100, opacity: 0, scale: 0.8, rotateY: 45 });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "horizontal-scroll",
          trigger: containerRef.current,
          pin: true,
          scrub: 0.5,
          start: "top top",
          end: "+=300%",
        }
      });

      // Transition background color of the main container
      tl.to(containerRef.current, {
        backgroundColor: "#050510",
        ease: "power2.inOut"
      }, 0);

      // Unusual 3D Transition
      tl.to(panels[0], {
        xPercent: -100,
        opacity: 0,
        scale: 0.8,
        rotateY: -45,
        ease: "none"
      }, 0)
        .to(panels[1], {
          xPercent: 0,
          opacity: 1,
          scale: 1,
          rotateY: 0,
          ease: "none"
        }, 0);

      // Fade in the dark overlay on the first panel
      tl.to(panels[0].querySelector('.panel-overlay'), {
        opacity: 1,
        ease: "none"
      }, 0);

      // Expose scrollToPanel for Navbar
      (window as any).scrollToPanel = (id: string) => {
        const st = ScrollTrigger.getById("horizontal-scroll");
        if (!st) return;

        if (id === "services") {
          gsap.to(window, { scrollTo: st.start, duration: 1.5, ease: "power2.inOut" });
        } else if (id === "portfolio") {
          gsap.to(window, { scrollTo: st.end, duration: 1.5, ease: "power2.inOut" });
        }
      };
    }, containerRef);

    return () => {
      ctx.revert();
      delete (window as any).scrollToPanel;
    };
  }, [isDesktop]);

  return (
    <div
      ref={containerRef}
      className={isDesktop ? "relative overflow-hidden transition-colors duration-500" : "relative"}
    >
      <div
        ref={panelsRef}
        className={isDesktop ? "relative h-screen w-full" : "block w-full"}
        style={isDesktop ? { perspective: "1500px" } : {}}
      >
        <AnimatedPanel
          id="services"
          className="bg-white"
          isDesktop={isDesktop}
        >
          <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
            <Services />
            {/* Dark overlay that fades in during scroll */}
            <div className="absolute inset-0 bg-black pointer-events-none opacity-0 panel-overlay" />
          </div>
        </AnimatedPanel>
        <AnimatedPanel
          id="portfolio"
          className="bg-black"
          isDesktop={isDesktop}
        >
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <Portfolio />
          </div>
        </AnimatedPanel>
      </div>
    </div>
  );
};

export default Portfolio2;