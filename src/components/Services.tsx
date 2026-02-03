import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { apiRequest } from "../../api/apiRequest";
import { useTranslation } from "react-i18next";
import Skeleton from "./Skeleton";

type Service = {
    id: number;
    icon: string;
    name: string;
    title: string;
    description: string;
};

type ServiceGroup = {
    id: number;
    title: string;
    description: string;
    service: Service[];
};

const Services = () => {
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useTranslation()
    const [apiData, setApiData] = useState<ServiceGroup | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const isDesktop = window.innerWidth > 1224;

    const openModal = (service: Service) => {
        setSelectedService(service);
        setIsModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedService(null);
        document.body.style.overflow = "unset";
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isModalOpen) {
                closeModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isModalOpen]);

    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };


    useEffect(() => {
        setIsLoading(true);
        apiRequest("get", "/our_services/")
            .then((data) => {
                setApiData(data as ServiceGroup);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);


    return (
        <>
            {isLoading ? (
                <section className="min-h-screen relative z-10 w-full pt-[80px] pb-12 lg:pt-[100px] lg:pb-16 bg-white overflow-visible">
                    <div className="mx-auto w-full max-w-[95%] px-4 sm:px-6 lg:px-8">
                        <div className="text-start mb-8">
                            <Skeleton width="50%" height="3.5rem" className="mb-4" mode="light" />
                            <Skeleton width="70%" height="1.2rem" variant="text" mode="light" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                <Skeleton key={i} height="10rem" mode="light" className="rounded-xl shadow-sm" />
                            ))}
                        </div>
                    </div>
                </section>
            ) : (
                <section
                    className="min-h-screen card card-1 relative z-10 w-full pt-[80px] pb-12 lg:pt-[100px] lg:pb-16 bg-white overflow-visible flex items-start"
                >
                    {/* Full height background grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,114,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,114,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
                    <div
                        className="absolute top-0 left-0 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse pointer-events-none"></div>
                    <div
                        className="absolute bottom-0 right-0 w-96 h-96 bg-sky-50 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse delay-1000 pointer-events-none"></div>

                    <div className="mx-auto w-full max-w-[95%] px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-start mb-4 sm:mb-6 lg:mb-8">
                            <h2 data-aos="fade-right"
                                data-aos-delay="100"
                                className="text-3xl sm:text-4xl md:text-4xl lg:text-4xl xl:text-6xl font-bold mb-2 text-gray-900 font-tech"
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {apiData?.title}
                            </h2>
                            <p data-aos="fade-right"
                                data-aos-delay="200"
                                className="hidden md:flex text-sm sm:text-base lg:text-lg text-gray-600 max-w-4xl leading-relaxed font-outfit"
                            >
                                {apiData?.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-4 2xl:gap-5 mt-8">
                            {apiData?.service &&
                                apiData?.service.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => openModal(item)}
                                        className="group relative h-auto bg-white rounded-xl p-3 sm:p-4 2xl:p-4 shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_rgba(0,114,255,0.1)] transition-all duration-500 cursor-pointer border border-gray-100 hover:border-blue-200 flex flex-col items-center justify-center text-center overflow-visible"
                                        style={{
                                            transformStyle: "preserve-3d",
                                            backfaceVisibility: "hidden",
                                        }}
                                        {...(isDesktop && {
                                            'data-aos': 'fade-up',
                                            'data-aos-duration': 300 + index * 40
                                        })}
                                    >
                                        {/* Icon Container with "Out of Frame" behavior */}
                                        <div className="relative mb-3 sm:mb-4">
                                            <div
                                                className="w-10 h-10 sm:w-12 sm:h-12 2xl:w-12 2xl:h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md transform transition-all duration-500 ease-out group-hover:-translate-y-8 group-hover:scale-110 group-hover:shadow-[0_10px_20px_rgba(0,114,255,0.25)] z-10"
                                            >
                                                <img
                                                    src={item.icon}
                                                    className="text-white w-6 h-6 sm:w-7 sm:h-7 2xl:w-7 2xl:h-7"
                                                    alt="card-icon"
                                                />
                                            </div>
                                            {/* Glow Effect behind icon on hover */}
                                            <div className="absolute inset-0 bg-blue-400/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-8 scale-110"></div>
                                        </div>

                                        {/* Title */}
                                        <div className="flex-1">
                                            <h3 className="text-xs sm:text-sm 2xl:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight font-テック">
                                                {item.title}
                                            </h3>
                                        </div>

                                        {/* Interactivity Indicator (Reveals on Hover) - Smaller */}
                                        <div className="mt-2 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300 flex items-center space-x-1 text-blue-600 font-medium text-[10px] sm:text-xs">
                                            <span>{t('more')}</span>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>
            )}

            {isModalOpen && selectedService && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
                    onClick={handleBackgroundClick}
                >
                    <div
                        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto z-[10000]"
                        style={{ isolation: 'isolate' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div
                            className="sticky top-0 bg-white rounded-t-2xl sm:rounded-t-3xl border-b border-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-between z-[10001]"
                        >
                            <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6 flex-1 min-w-0">
                                <div
                                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                                >
                                    <img
                                        src={selectedService?.icon}
                                        className="text-white w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                                        alt={selectedService.title}
                                    />
                                </div>
                                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                    {selectedService.title}
                                </h2>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0 ml-4"
                            >
                                <X size={20} className="text-gray-500 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6 lg:p-8 relative z-[10001]">
                            <div>
                                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                                    {t('more')}
                                </h3>
                                <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                                    {selectedService.description}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 rounded-b-2xl sm:rounded-b-3xl p-4 sm:p-6 lg:p-8 relative z-[10001]">
                            <div className="flex justify-end space-x-3 sm:space-x-4">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-3 bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-300 transition-colors duration-200 text-sm sm:text-base lg:text-lg font-medium"
                                >
                                    {t('close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Services;