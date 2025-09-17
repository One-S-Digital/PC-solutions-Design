import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from 'packages/contexts/src/AppContext';
import { SupportedLanguage } from 'packages/core/src/types';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { UKFlagIcon, FrenchFlagIcon, GermanFlagIcon } from '../icons/CustomIcons';
import { useTranslation } from 'react-i18next'; 

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation(); 
  const { language, setLanguage } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: SupportedLanguage; labelKey: string; nameKey: string; flag: React.ElementType }[] = [
    { code: 'EN', labelKey: 'languageSwitcher.enShort', nameKey: 'languageSwitcher.enLong', flag: UKFlagIcon },
    { code: 'FR', labelKey: 'languageSwitcher.frShort', nameKey: 'languageSwitcher.frLong', flag: FrenchFlagIcon },
    { code: 'DE', labelKey: 'languageSwitcher.deShort', nameKey: 'languageSwitcher.deLong', flag: GermanFlagIcon },
  ];

  const currentLanguageDetails = languages.find(lang => lang.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCode: SupportedLanguage) => {
    setLanguage(langCode); 
    setIsOpen(false);
  };
  
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
        <button type="button" onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center w-full rounded-md border border-border shadow-sm px-3 py-2 bg-surface-1 text-sm font-medium text-text-default hover:bg-surface-2">
          <currentLanguageDetails.flag className="w-5 h-auto mr-2" />
          {t(currentLanguageDetails.labelKey)}
          <ChevronDownIcon className="ml-1.5 h-5 w-5 text-text-muted" />
        </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-surface-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {languages.map(lang => (
                <button key={lang.code} onClick={() => handleLanguageSelect(lang.code)}
                  className={`${language === lang.code ? 'bg-surface-2' : ''} group flex items-center w-full px-4 py-2 text-sm text-text-default hover:bg-surface-2`}>
                  <lang.flag className="w-5 h-auto mr-3" />
                  {t(lang.nameKey)}
                </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
