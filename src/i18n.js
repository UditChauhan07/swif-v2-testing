import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// import en from "./locales/en.json";
import fr from "./Lang/French/fr2.json";
import es from "./Lang/Spanish/es.json";
let savedLanguage = localStorage.getItem("defaultLanguage") || "en";
const userRole = localStorage.getItem("Role");
console.log("defaultLanguage",savedLanguage)

if (userRole === "SuperAdmin") {
  savedLanguage = "en"; 
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
    //   en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
    },
    lng: savedLanguage, 
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
