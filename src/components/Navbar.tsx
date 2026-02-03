import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import logoWhite from "../../assets/logo-white.png";
import Language from "./Language";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle scrolling when location changes
    useEffect(() => {
        const hash = window.location.hash;
        if (hash && location.pathname === "/") {
            const id = hash.replace("#", "");
            setTimeout(() => {
                scrollToElement(id);
            }, 700);
        }
    }, [location]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isMenuOpen]);

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
                el.scrollIntoView({ behavior: "smooth" });
            }
        }

        // Clear the hash from URL after scrolling
        setTimeout(() => {
            window.history.replaceState(null, "", window.location.pathname);
        }, 1000); // Wait 1 second for scroll to complete
    };

    const scrollToSection = (id: string) => {
        if (id === "about") {
            navigate("/about-us/");
            window.location.reload();
            return;
        }

        // Close mobile menu
        setIsMenuOpen(false);

        // If we're not on the home page, navigate to home with hash
        if (location.pathname !== "/") {
            navigate(`/#${id}`);
            return;
        }

        // If we're already on the home page, scroll directly
        scrollToElement(id);
    };

    const isPageNotFound = !['/', '/portfolio', '/about-us'].includes(location.pathname);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isPageNotFound
                ? "bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-lg"
                : "bg-transparent"
                }`}
        >
            <div className="flex items-center justify-between h-[80px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex-shrink-0">
                    <a
                        href="/"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        <img
                            src={logoWhite}
                            alt="uft logo"
                            className="w-[100px] transition-all duration-300"
                        />
                    </a>
                </div>

                <nav className="hidden lg:block">
                    <div className="ml-10 flex items-baseline space-x-8">
                        {[
                            { id: "about", label: "about" },
                            { id: "services", label: "services" },
                            { id: "portfolio", label: "portfolio" },
                            { id: "tools", label: "tools" },
                            { id: "contact", label: "contact" }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`relative font-bold transition-all duration-300 group text-white hover:text-white/80`}
                            >
                                {t(item.label)}
                                <span className={`absolute left-0 -bottom-1 w-0 h-[2px] transition-all duration-300 group-hover:w-full bg-white`}></span>
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="flex gap-3 items-center">
                    <div className="lg:flex hidden">
                        <Language />
                    </div>
                    <button
                        onClick={() => scrollToSection("contact")}
                        className={`hidden lg:inline-flex items-center px-6 py-2 border-2 font-bold text-sm rounded-full transition-all duration-200 border-[#b0f1f5] text-white hover:shadow-[0px_0px_46px_-7px_#72f8ff]`}
                    >
                        {t("submitRequest")}
                    </button>
                </div>

                <div className="lg:hidden">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="text-white"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 w-full h-screen"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <div
                        className="fixed top-0 right-0 h-screen w-[60%] bg-black text-white p-6 space-y-4 transition-transform duration-300 z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <img src={logoWhite} className="w-24" alt="uft logo" />
                            <button onClick={() => setIsMenuOpen(false)} className="text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <button
                            onClick={() => scrollToSection("about")}
                            className="block w-full text-left px-2 py-2 text-gray-300 hover:text-white font-light"
                        >
                            {t("about")}
                        </button>

                        <button
                            onClick={() => scrollToSection("services")}
                            className="block w-full text-left px-2 py-2 text-gray-300 hover:text-white font-light"
                        >
                            {t("services")}
                        </button>

                        <button
                            onClick={() => scrollToSection("portfolio")}
                            className="block w-full text-left px-2 py-2 text-gray-300 hover:text-white font-light"
                        >
                            {t("portfolio")}
                        </button>

                        <button
                            onClick={() => scrollToSection("tools")}
                            className="block w-full text-left px-2 py-2 text-gray-300 hover:text-white font-light"
                        >
                            {t("tools")}
                        </button>

                        <button
                            onClick={() => scrollToSection("contact")}
                            className="block w-full text-left px-2 py-2 text-gray-300 hover:text-white font-light"
                        >
                            {t("contact")}
                        </button>

                        <button
                            onClick={() => scrollToSection("contact")}
                            className="block px-3 py-2 border-2 border-purple-500 hover:bg-purple-500 text-white rounded-full mt-4 font-light"
                        >
                            {t("submitRequest")}
                        </button>

                        <div className="pt-4">
                            <Language />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;