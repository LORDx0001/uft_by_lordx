import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./translations";
import { languages } from "../../assets/constants/constants";

const browserLanguage = navigator.language.split("-")[0];
const defaultLanguage = "en";

const detectedLanguage = languages.includes(browserLanguage)
  ? browserLanguage
  : defaultLanguage;

i18n.use(initReactI18next).init({
  resources,
  lng: detectedLanguage,
  fallbackLng: defaultLanguage,
  interpolation: { escapeValue: false },
});
export default i18n;
