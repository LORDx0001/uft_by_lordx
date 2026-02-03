import img from "../../assets/portfolio-background.png"; // Your background decorative image
import { ExternalLink } from "lucide-react"; // Optional icon for links
import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";

type PortfolioCards = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  created_at: string;
  updated_at: string;
  colspan: number;
  rowspan: number;
};

type PortfolioAbout = {
  title: string;
  description: string;
};

const Portfolio = () => {
  const [projects, setProjects] = useState<PortfolioCards[] | []>([]);
  const [portfolioAbout, setPortfolioAbout] = useState<PortfolioAbout[] | []>(
    []
  );

  useEffect(() => {
    apiRequest<PortfolioCards[]>("get", "/portfolio/all/").then((data) => {
      setProjects(data);
    });

    apiRequest<PortfolioAbout[]>("get", "/portfolio/about/").then((data) => {
      setPortfolioAbout(data);
    });
  }, []);

  return (
    <section className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>

        {/* Floating Shapes - Adjusted for mobile */}
        <div className="absolute top-20 right-4 sm:right-20 w-20 h-20 sm:w-32 sm:h-32 opacity-20">
          <div
            className="w-full h-full border-2 border-cyan-400 animate-pulse"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          ></div>
        </div>
        <div className="absolute top-40 left-4 sm:left-20 w-16 h-16 sm:w-24 sm:h-24 opacity-20">
          <div className="w-full h-full border-2 border-cyan-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-40 right-10 sm:right-40 w-12 h-12 sm:w-20 sm:h-20 opacity-20">
          <div className="w-full h-full border-2 border-cyan-400 animate-pulse"></div>
        </div>

        {/* SVG Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 Q50,5 100,20 T200,20"
            stroke="url(#gradient)"
            strokeWidth="0.5"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M0,80 Q50,65 100,80 T200,80"
            stroke="url(#gradient)"
            strokeWidth="0.5"
            fill="none"
            className="animate-pulse"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Foreground */}
      <div className="mt-16 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
        {/* Header */}
        <div className="text-left mb-8 md:mb-16 relative">
          <div className="flex items-center gap-4 md:gap-8 mb-4 md:mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mt-2 xl:mt-[60px]">
              {portfolioAbout[0]?.title}
            </h1>
            <div className="absolute top-10 md:top-20 -right-20 md:-right-52">
              <img
                src={img}
                alt="Portfolio Background"
                className="w-32 h-32 md:w-64 md:h-64 object-cover"
                style={{ filter: "brightness(40%)" }}
              />
            </div>
          </div>
          <p className="text-base md:text-xl text-gray-300 max-w-2xl leading-relaxed">
            {portfolioAbout[0]?.description}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[150px] sm:auto-rows-[200px] pb-10 gap-4 sm:gap-6">
          {projects?.map((project) => {
            // Responsive colSpan and rowSpan handling
            const colSpanClass = project.colspan === 2 ? "sm:col-span-2" : "";
            const rowSpanClass = project.rowspan === 2 ? "sm:row-span-2" : "";

            return (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden group transition hover:shadow-xl hover:-translate-y-1 duration-300 ${colSpanClass} ${rowSpanClass}`}
              >
                {/* Image - always visible */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay content - only visible on hover */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {project.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-1 text-cyan-400 text-xs sm:text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    Visit{" "}
                    <ExternalLink
                      size={12}
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                    />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Floating dots - Adjusted for mobile */}
      <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 w-3 h-3 sm:w-4 sm:h-4 bg-cyan-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-20 right-20 sm:top-32 sm:right-32 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute bottom-24 right-12 sm:bottom-32 sm:right-20 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full opacity-60 animate-pulse"></div>
    </section>
  );
};

export default Portfolio;