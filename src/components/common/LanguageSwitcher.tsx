import React from 'react';
import { Languages } from 'lucide-react';
import { useTranslation, SupportedLanguage } from '../../i18n';

interface LanguageSwitcherProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  showIcon = true,
}) => {
  const { language, setLanguage } = useTranslation();

  const handleSelect = (lang: SupportedLanguage) => {
    if (language !== lang) {
      setLanguage(lang);
    }
  };

  return (
    <div
      className={`inline-flex items-center p-1 rounded-2xl bg-[#E2F0F9]/80 border border-[#CCE2F2] shadow-2xs text-xs font-bold transition-all ${className}`}
      role="group"
      aria-label="Language selection"
    >
      {showIcon && (
        <div className="pl-2 pr-1 text-[#1E75AC] hidden sm:flex items-center">
          <Languages className="h-3.5 w-3.5" />
        </div>
      )}

      <button
        type="button"
        onClick={() => handleSelect('en')}
        className={`px-2.5 py-1 rounded-xl transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC] focus-visible:outline-offset-1 ${
          language === 'en'
            ? 'bg-[#2F8FCC] text-white shadow-2xs font-extrabold cursor-default'
            : 'text-[#527290] hover:text-[#123F63] hover:bg-[#D5EEFB]/60 active:scale-[0.98]'
        }`}
        aria-pressed={language === 'en'}
      >
        English
      </button>

      <span className="text-[#CCE2F2] select-none px-0.5">|</span>

      <button
        type="button"
        onClick={() => handleSelect('hi')}
        className={`px-2.5 py-1 rounded-xl transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2F8FCC] focus-visible:outline-offset-1 ${
          language === 'hi'
            ? 'bg-[#2F8FCC] text-white shadow-2xs font-extrabold cursor-default'
            : 'text-[#527290] hover:text-[#123F63] hover:bg-[#D5EEFB]/60 active:scale-[0.98]'
        }`}
        aria-pressed={language === 'hi'}
      >
        हिंदी
      </button>
    </div>
  );
};
