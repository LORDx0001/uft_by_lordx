import { useEffect, useRef, useState } from "react";
import i18n from "../i18n/i18n";
import { Globe, ChevronDown } from "lucide-react";

type LanguageCode = "uz" | "ru" | "en" | "kk" | "ar";

const LANGUAGES: Record<LanguageCode, string> = {
  uz: "UZ",
  ru: "RU",
  en: "EN",
  kk: "KK",
  ar: "AR",
};

const SUPPORTED_LANGS = Object.keys(LANGUAGES) as LanguageCode[];

const getInitialLanguage = (): LanguageCode => {
  const storedLang = localStorage.getItem("lang");
  if (storedLang && SUPPORTED_LANGS.includes(storedLang as LanguageCode)) {
    return storedLang as LanguageCode;
  }

  const detected = i18n.language?.split("-")[0] as LanguageCode | undefined;
  if (detected && SUPPORTED_LANGS.includes(detected)) {
    return detected;
  }

  return "en";
};

const Language = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(() =>
    getInitialLanguage()
  );
  const [forceUpdate, setForceUpdate] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    i18n.changeLanguage(selectedLang);
  }, [selectedLang]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = async (lang: LanguageCode) => {
    setSelectedLang(lang);
    localStorage.setItem("lang", lang);

    await i18n.changeLanguage(lang);
    setForceUpdate(prev => prev + 1);
    setIsOpen(false);

    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  return (
    <div className="relative inline-block text-left z-50" ref={modalRef} key={forceUpdate}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 text-xs font-bold bg-black/40 backdrop-blur-xl text-white border border-blue-500/30 rounded-lg hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 group"
      >
        <Globe size={14} className="text-blue-400 group-hover:rotate-180 transition-transform duration-700" />
        <span className="font-tech tracking-wider">{LANGUAGES[selectedLang]}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-black/80 backdrop-blur-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="py-2 border-b border-white/5 bg-white/5">
            <p className="px-4 py-1 text-[10px] font-tech text-blue-400/70 tracking-[0.2em] uppercase">Select Region</p>
          </div>
          <div className="py-1">
            {Object.entries(LANGUAGES).map(([key, label]) => {
              const isActive = key === selectedLang;
              return (
                <button
                  key={key}
                  onClick={() => handleLanguageChange(key as LanguageCode)}
                  className={`w-full px-4 py-2.5 font-tech text-xs text-left transition-all duration-200 flex items-center justify-between group/item ${isActive
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <span className="tracking-widest">{label === "UZ" ? "Uzbek" : label === "RU" ? "Russian" : label === "EN" ? "English" : label === "KK" ? "Kazakh" : "Arabic"}</span>
                  {isActive && <div className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Language;