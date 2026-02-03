import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import toast from "react-hot-toast";
import ScrollingLogos from "../components/ScrollingLogos";
import TechBackground from "../components/TechBackground";
import { t } from "i18next";
import Skeleton from "../components/Skeleton";

type AboutUs = { title: string; description: string; media: string };
type CardType = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const AboutUs = () => {
  const [aboutUs, setAboutUs] = useState<AboutUs[] | []>([]);
  const [cards, setCards] = useState<CardType[] | []>([]);
  const [isVisible, setIsVisible] = useState(false);

  const description = aboutUs[0]?.description.replace(/\<br\s*\/?\>/gi, "\n");
  const title = aboutUs[0]?.title.replace(/\<br\s*\/?\>/gi, "\n");

  useEffect(() => {
    apiRequest<AboutUs[]>("get", "/about/")
      .then((data) => setAboutUs(data))
      .catch(() => toast.error("Something went wrong!"));

    apiRequest<CardType[]>("get", "/about/us/")
      .then((data) => setCards(data))
      .catch(() => toast.error("Something went wrong!"));
  }, []);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section>
      <div className="relative overflow-hidden min-h-screen lg:min-h-[800px] flex items-center justify-center py-20 lg:py-32">
        <TechBackground />
        <div className="relative z-10 w-full max-w-[1500px] min-w-[360px] mx-[5px] lg:mx-auto text-white">
          <div className="w-full flex flex-col lg:flex-row items-center justify-center pb-[100px] md:px-10 px-[5px] 2xl:px-0 gap-[20px]">
            <div className="flex flex-col items-center max-w-5xl w-full">
              {aboutUs.length > 0 ? (
                <>
                  <pre
                    className={`font-tech text-3xl pt-[30px] text-wrap text-center sm:text-4xl lg:text-5xl font-bold mb-[20px] px-4 lg:px-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                  >
                    {title}
                  </pre>
                  <pre
                    className={`font-outfit text-lg pb-[20px] font-[400] sm:text-xl w-full max-w-full xl:max-w-[90%] px-4 lg:px-0 lg:mx-0 whitespace-pre-wrap text-center leading-relaxed opacity-90 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                  >
                    {description}
                  </pre>
                </>
              ) : (
                <div className="w-full flex flex-col items-center space-y-6 pt-10">
                  <Skeleton width="80%" height="4rem" />
                  <div className="w-full space-y-2 flex flex-col items-center">
                    <Skeleton width="90%" height="1.2rem" variant="text" />
                    <Skeleton width="85%" height="1.2rem" variant="text" />
                    <Skeleton width="40%" height="1.2rem" variant="text" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full z-20">
          <ScrollingLogos />
        </div>
      </div>

      <div className="bg-[linear-gradient(36deg,_#ffffff_56%,_rgba(4,0,255,0.32)_100%)]">
        <div className="py-[50px] px-4 sm:px-2 lg:px-2 max-w-[1200px] mx-auto">
          <h2
            className={`font-tech font-bold text-3xl md:text-[55px] mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
          >
            {t("aboutUsCardsTitle")}
          </h2>
          <div className="w-full max-w-[1200px] mx-auto mt-[50px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {cards.length > 0 ? (
                cards.map((item, index) => (
                  <div
                    key={item?.id}
                    className={`group w-full max-w-[390px] min-h-[300px] flex flex-col py-[29px] px-[23px] bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-blue-200 relative overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                    style={{
                      transitionDelay: `${600 + index * 150}ms`
                    }}
                  >
                    {/* Animated gradient background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-sky-50/0 group-hover:from-blue-50/50 group-hover:to-sky-50/30 transition-all duration-500 rounded-2xl"></div>

                    {/* Icon container with animation */}
                    <div className="relative z-10 mb-[15px] w-[60px] h-[60px] bg-gradient-to-br from-blue-100 to-sky-100 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <img
                        src={item?.icon}
                        alt="cardImg"
                        className="w-[35px] h-[35px] object-contain"
                      />
                    </div>

                    <h3 className="relative z-10 font-tech font-bold text-[22px] my-[18px] group-hover:text-blue-600 transition-colors duration-300">
                      {item?.title}
                    </h3>
                    <p className="relative z-10 font-outfit text-[16px] text-[#555] leading-relaxed">
                      {item?.description}
                    </p>

                    {/* Animated corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/0 to-sky-400/0 group-hover:from-blue-400/10 group-hover:to-sky-400/20 rounded-bl-full transition-all duration-500"></div>
                  </div>
                ))
              ) : (
                [1, 2, 3].map((i) => (
                  <Skeleton key={i} width="100%" height="300px" mode="light" className="max-w-[390px]" />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
