import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import video from "../../assets/small.webm";
import FeedbackModal from "./FeedbackModal";
import { useTranslation } from "react-i18next";
import { apiRequest } from "../../api/apiRequest";
import toast from "react-hot-toast";

type Testimonial = {
  id: number;
  last_name: string;
  first_name: string;
  position: string;
  company_name: string;
  comment: string;
  image: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  feedback_file: string;
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [screenSize, setScreenSize] = useState("desktop");
  const [testimonials, setTestimonials] = useState<Testimonial[] | []>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Track screen size for responsive testimonial display
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
      } else if (width >= 768 && width < 1280) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get number of visible testimonials based on screen size
  const getVisibleCount = () => {
    switch (screenSize) {
      case "mobile":
        return 1;
      case "tablet":
        return 4;
      case "desktop":
        return 3;
      default:
        return 3;
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && testimonials && testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, testimonials]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const getVisibleTestimonials = (): Testimonial[] => {
    const count = getVisibleCount();
    if (!testimonials || testimonials.length === 0) return [];
    if (testimonials.length <= count) return testimonials;

    const rotated = testimonials
      .slice(currentIndex)
      .concat(testimonials.slice(0, currentIndex));

    const result: Testimonial[] = [];
    if (testimonials.length > 0) {
      const iters = testimonials.length < count ? testimonials.length : count;
      for (let i = 0; i < iters; i++) {
        result.push(testimonials[(currentIndex + i) % testimonials.length]);
      }
    }
    return rotated.slice(0, count);
  };

  const visibleTestimonials = getVisibleTestimonials();

  const getGridClasses = () => {
    switch (screenSize) {
      case "mobile":
        return "grid grid-cols-1 gap-8";
      case "tablet":
        return "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8";
      case "desktop":
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8";
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8";
    }
  };

  useEffect(() => {
    setIsLoading(true);
    apiRequest<Testimonial[]>("get", "/client/comment/")
      .then((data) => {
        setTestimonials(data);
      })
      .catch(() => {
        toast.error("Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <section
      id="testimonals"
      className={`${screenSize === "desktop" ? "min-h-screen sticky top-0" : screenSize === 'laptop' ? "min-h-[110vh] relative" : "relative"
        } z-20 pt-32 pb-20 scroll-mt-24 flex flex-col justify-start`}
    >
      <video autoPlay muted loop playsInline id="bg-video">
        <source src={video} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-start mb-6">
          <div className="lg:flex justify-between items-center">
            <h2 className="text-2xl lg:text-4xl md:text-5xl font-bold text-white mb-2">
              {t("testimonialsTitle")}
            </h2>
            <div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-sky-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
              >
                {t("leaveComment")}
              </button>

              <FeedbackModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>
          <p className="text-sm lg:text-xl text-gray-300 mt-2 font-montserrat max-w-2xl">
            {t("testimonialsDesc")}
          </p>
        </div>

        <div className="relative z-40">
          <div className={getGridClasses()}>
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${currentIndex}`}
                className={`bg-black/40 backdrop-blur-xl rounded-3xl p-8 transform transition-all duration-700 border border-white/5 hover:border-blue-500/30 group/card relative overflow-hidden
                                      ${screenSize === "tablet" &&
                    visibleTestimonials.length === 4 &&
                    (index === 1 || index === 2)
                    ? "scale-100"
                    : screenSize === "desktop" &&
                      index === 1
                      ? "scale-105 lg:scale-105"
                      : "scale-100 opacity-80 hover:opacity-100"
                  }
                                  `}
              >
                {/* Subtle Glow Effect on Hover */}
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-sky-400 rounded-full opacity-20 group-hover/card:opacity-40 transition-opacity"></div>
                      <img
                        src={testimonial.image}
                        alt={testimonial.image}
                        className="w-14 h-14 rounded-full object-cover relative z-10 border-2 border-white/10"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-white font-bold text-lg tracking-tight">
                        {testimonial.first_name + " " + testimonial.last_name}
                      </h4>
                      <p className="text-blue-400/80 text-sm font-tech">
                        {testimonial.position}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl group-hover/card:bg-blue-500/10 transition-colors">
                    <Quote className="text-blue-400/60" size={24} />
                  </div>
                </div>

                <p className="h-48 overflow-y-auto scrollbar-subtle text-gray-300 mb-6 leading-relaxed italic font-outfit text-base lg:text-lg pr-2 relative z-10">
                  "{testimonial.comment}"
                </p>

                {testimonial?.feedback_file && (
                  <div className="relative z-10 mt-auto flex justify-end">
                    <a href={testimonial?.feedback_file} download target="_blank" className="block">
                      <button
                        type="button"
                        className="bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/50 text-blue-300 font-tech font-medium text-xs py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                      >
                        {t("download")}
                      </button>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center mt-12 gap-4 there_dots">
            <button
              onClick={prevTestimonial}
              className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors duration-200"
            >
              <ChevronLeft className="text-white" size={24} />
            </button>

            <div className="flex gap-2">
              {testimonials &&
                testimonials?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === currentIndex ? "bg-blue-500" : "bg-white/30"
                      }`}
                  />
                ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors duration-200"
            >
              <ChevronRight className="text-white" size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
