import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { apiRequest } from "../../api/apiRequest";
import toast from "react-hot-toast";
import { PhoneSelect } from "./PhoneSelect";

type SocialType = {
    id: number;
    name: string;
    link: string;
    logo: string;
    is_active: boolean;
};

type ContactAboutType = {
    id: number;
    title: string;
    description: string;
    location: string;
    phone_number: string;
};

const Footer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [social, setSocial] = useState<SocialType[] | []>([]);
    const [contactAbout, setContactAbout] = useState<ContactAboutType[] | []>([]);

    // Handle scrolling when location changes
    useEffect(() => {
        const hash = window.location.hash;
        if (hash && location.pathname === "/") {
            const id = hash.replace("#", "");
            setTimeout(() => {
                scrollToElement(id);
            }, 100);
        }
    }, [location]);

    const scrollToElement = (id: string) => {
        // Check if this is one of the horizontal scroll sections
        const horizontalSections = ["services", "portfolio"];

        if (horizontalSections.includes(id)) {
            // Use the global scrollToPanel function for horizontal scroll sections
            if (window.scrollToPanel) {
                window.scrollToPanel(id);
            } else {
                // Fallback: wait a bit and try again (in case GSAP hasn't loaded yet)
                setTimeout(() => {
                    if (window.scrollToPanel) {
                        window.scrollToPanel(id);
                    }
                }, 100);
            }
        } else {
            // Use regular scrollIntoView for other sections
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({behavior: "smooth"});
            }
        }

        // Clear the hash from URL after scrolling
        setTimeout(() => {
            window.history.replaceState(null, "", window.location.pathname);
        }, 1000); // Wait 1 second for scroll to complete
    };

    const scrollToSection = (id: string) => {
        // Handle "about" specially - it's a separate page, not a section
        if (id === "about") {
            navigate("/about-us/");
            window.location.reload();
            return;
        }

        // If we're not on the home page, navigate to home with hash
        if (location.pathname !== "/") {
            navigate(`/#${id}`);
            return;
        }

        // If we're already on the home page, scroll directly
        scrollToElement(id);
    };

    useEffect(() => {
        apiRequest("get", "/contact/social-media/")
            .then((data) => setSocial(data as SocialType[]))
            .catch(() => toast.error("Something went wrong!"));

        apiRequest("get", "/contact/contact-about/")
            .then((data) => setContactAbout(data as ContactAboutType[]))
            .catch(() => toast.error("Something went wrong!"));
    }, []);

    return (
        <footer className="relative bg-black text-white z-30 sm:mt-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Main Footer Content */}
                <div className="flex flex-col pt-6 md:flex-row lg:justify-between items-center md:items-start gap-6 md:gap-8 text-center md:text-left">

                    {/* Company Info */}
                    <div className="flex flex-col items-center md:items-start w-full md:w-auto md:flex-1">
                        <div className="flex-shrink-0 max-w-xs">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-white to-cyan-400 bg-clip-text text-transparent mb-2">
                                {contactAbout[0]?.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {contactAbout[0]?.description}
                            </p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-4 items-center md:items-start w-full md:w-auto md:flex-1">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-sky-700 rounded-full flex items-center justify-center">
                                <MapPin className="text-white" size={14} />
                            </div>
                            <p className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                                {contactAbout[0]?.location}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <PhoneSelect />
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-shrink-0 w-full md:w-auto md:flex-1">
                        <h4 className="text-base font-semibold mb-3 text-white">
                            {t("services")}
                        </h4>
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-1">
                            {["about", "services", "portfolio", "tools", "contact"].map((id) => (
                                <button
                                    key={id}
                                    onClick={() => scrollToSection(id)}
                                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm md:text-base block"
                                >
                                    {t(id)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 mt-6 pt-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 text-center">
                    <p className="text-gray-400 text-xs">{t("copyright")}</p>
                    <div className="flex space-x-2">
                        {social.map((item, i) => (
                            <a
                                key={i}
                                href={`${item.link.includes("@") ? `mailto:${item?.link}` : `tel:${item?.link}`}`}
                                className="p-2 bg-white/10 rounded-full hover:bg-blue-600 transition-all duration-200 hover:scale-110"
                            >
                                <img src={item?.logo} width={16} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;