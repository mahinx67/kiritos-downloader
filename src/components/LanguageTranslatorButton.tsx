import React from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface LanguageTranslatorButtonProps {
  className?: string;
  isFloating?: boolean;
}

export const LanguageTranslatorButton: React.FC<LanguageTranslatorButtonProps> = ({ 
  className = "",
  isFloating = false
}) => {
  const { toggleLanguage, isBangla } = useLanguage();

  return (
    <button
      id="btn-language-translator"
      type="button"
      onClick={toggleLanguage}
      title={isBangla ? "Switch to English" : "বাংলায় অনুবাদ করুন (Translate to Bangla)"}
      aria-label="Toggle language between English and Bangla"
      className={`relative inline-flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full transition-all duration-200 cursor-pointer select-none active:scale-90 shadow-xs hover:shadow-md focus:outline-hidden ${
        isBangla
          ? "bg-gradient-to-tr from-emerald-600 to-teal-600 text-white border border-emerald-400 shadow-emerald-600/20"
          : "bg-white/95 hover:bg-white text-slate-700 hover:text-emerald-700 border border-emerald-200/80 hover:border-emerald-400 shadow-slate-200"
      } ${
        isFloating ? "backdrop-blur-xl" : ""
      } ${className}`}
    >
      <Languages className="w-4 h-4 stroke-[2.2]" />
    </button>
  );
};

export default LanguageTranslatorButton;
