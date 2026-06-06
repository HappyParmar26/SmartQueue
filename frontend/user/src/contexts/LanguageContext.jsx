import { createContext, useEffect, useMemo, useState } from "react";

import en from "../locales/en.json";
import hi from "../locales/hi.json";
import gu from "../locales/gu.json";

export const LanguageContext = createContext();

const translations = {
  en,
  hi,
  gu,
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key) => {
    const value = key
      .split(".")
      .reduce(
        (obj, current) => obj?.[current],
        translations[language]
      );

    return value || key;
  };

  const value = useMemo(
    () => ({
      language,
      changeLanguage,
      t,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}