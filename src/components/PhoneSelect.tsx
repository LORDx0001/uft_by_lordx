import { useState, useEffect, useRef } from "react";
import { ChevronDown, Phone, Mail, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

export const PhoneSelect = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const phoneNumbers = [
        { label: t('allContacts'), value: "all", icon: <UserPlus size={14} /> },
        { label: "+998 (33) 181-35-35", value: "phone", icon: <Phone size={14} /> },
        { label: "+998 (77) 448-47-74", value: "phone", icon: <Phone size={14} /> },
        { label: "uniquefuturetechnology@gmail.com", value: "email", icon: <Mail size={14} /> },
        { label: "IT.TechCompanyFE@gmail.com", value: "email", icon: <Mail size={14} /> },
    ];

    const [selected, setSelected] = useState(phoneNumbers[0]);

    const handleSelect = (option: (typeof phoneNumbers)[0]) => {
        setSelected(option);
        setIsOpen(false);

        if (option.value === "phone") {
            window.location.href = `tel:${option.label.replace(/[^+\d]/g, "")}`;
        } else if (option.value === "email") {
            window.location.href = `mailto:${option.label}`;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="relative inline-block text-left">
            <button
                onClick={toggleDropdown}
                className="group flex items-center gap-3 w-full px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg"
            >
                <span className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-blue-400">{selected.icon}</span>
                    <span className="truncate max-w-[150px] md:max-w-none">{selected.label}</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-blue-400 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} />
            </button>

            {isOpen && (
                <ul className="absolute bottom-full left-0 mb-3 w-max min-w-[240px] py-2 bg-zinc-900/90 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="px-3 py-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-1">
                            {t("contactUs")}
                        </span>
                    </div>
                    {phoneNumbers.map((option) => (
                        <li
                            key={option.label}
                            onClick={() => handleSelect(option)}
                            className={`px-4 py-2.5 flex items-center gap-3 cursor-pointer transition-all duration-200 group/item
                                ${option.label === selected.label ? "bg-blue-600/10 text-blue-400" : "text-gray-400 hover:text-white hover:bg-white/5"}
                            `}
                        >
                            <span className={`${option.label === selected.label ? "text-blue-400" : "text-gray-500 group-hover/item:text-blue-400"} transition-colors`}>
                                {option.icon}
                            </span>
                            <span className="text-sm font-medium">{option.label}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
