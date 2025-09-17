
import React from 'react';
import { SettingsFormData, UserRole, SwissCanton, SupportedLanguage } from 'packages/core/src/types';
import { STANDARD_INPUT_FIELD, SWISS_CANTONS } from 'packages/core/src/constants';
import SettingsSectionWrapper from '../SettingsSectionWrapper';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface CompanyProfileSettingsProps {
  settings: SettingsFormData;
  onChange: (field: keyof SettingsFormData, value: any) => void;
  userRole: UserRole;
}

const SUPPORTED_LANGUAGES_OPTIONS_BASE: { labelKey: string, value: SupportedLanguage }[] = [
    { labelKey: 'languageSwitcher.en', value: 'EN'},
    { labelKey: 'languageSwitcher.fr', value: 'FR'},
    { labelKey: 'languageSwitcher.de', value: 'DE'},
];

const CompanyProfileSettings: React.FC<CompanyProfileSettingsProps> = ({ settings, onChange, userRole }) => {
  const { t } = useTranslation();
  
  const handleMultiSelectChange = (field: keyof SettingsFormData, selectedValue: string) => {
    const currentValues = (settings[field] as string[] || []) as Array<SwissCanton | SupportedLanguage>;
    let newValues: Array<SwissCanton | SupportedLanguage>;
    if (currentValues.includes(selectedValue as any)) {
      newValues = currentValues.filter(v => v !== selectedValue);
    } else {
      newValues = [...currentValues, selectedValue as any];
    }
    onChange(field, newValues);
  };

  const translatedLanguageOptions = SUPPORTED_LANGUAGES_OPTIONS_BASE.map(opt => ({...opt, label: t(opt.labelKey)}));


  return (
    <SettingsSectionWrapper title={t('settingsPage.companyProfile')} icon={BuildingOfficeIcon}>
      <div className="grid grid-cols-1 md:grid-cols-form-layout gap-x-6 gap-y-4 items-start">
        {/* Company Name */}
        <label htmlFor="companyName" className="form-label md:pt-2">{t('settingsCompanyProfile.companyName')} <span className="text-swiss-coral">*</span></label>
        <div className="form-input-container">
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={settings.companyName || ''}
            onChange={(e) => onChange('companyName', e.target.value)}
            className={STANDARD_INPUT_FIELD}
            required
          />
        </div>

        {/* Logo Upload - Placeholder */}
        <label className="form-label">{t('settingsCompanyProfile.logo')}</label>
        <div className="form-input-container">
          {/* <FileUploadZone onFileUpload={(file) => onChange('logoUrl', 'mock-logo-url.png')} /> Placeholder */}
          <input type="file" className={`${STANDARD_INPUT_FIELD} p-0 file:mr-4 file:py-2 file:px-4 file:rounded-l-button file:border-0 file:text-sm file:font-semibold file:bg-swiss-teal/10 file:text-swiss-teal hover:file:bg-swiss-teal/20`}/>
          {settings.logoUrl && <img src={settings.logoUrl} alt="logo preview" className="mt-2 h-16 w-auto"/>}
        </div>

        {/* Cover Image Upload - Placeholder */}
        <label className="form-label">{t('settingsCompanyProfile.coverImage')}</label>
        <div className="form-input-container">
          {/* <FileUploadZone onFileUpload={(file) => onChange('coverImageUrl', 'mock-cover-url.png')} /> Placeholder */}
           <input type="file" className={`${STANDARD_INPUT_FIELD} p-0 file:mr-4 file:py-2 file:px-4 file:rounded-l-button file:border-0 file:text-sm file:font-semibold file:bg-swiss-teal/10 file:text-swiss-teal hover:file:bg-swiss-teal/20`}/>
          {settings.coverImageUrl && <img src={settings.coverImageUrl} alt="cover preview" className="mt-2 h-24 w-auto object-cover rounded"/>}
        </div>

        {/* About Text */}
        <label htmlFor="aboutText" className="form-label md:pt-2">{t('settingsCompanyProfile.aboutText')} <span className="text-swiss-coral">*</span></label>
        <div className="form-input-container">
          <textarea
            id="aboutText"
            name="aboutText"
            rows={4}
            maxLength={500}
            value={settings.aboutText || ''}
            onChange={(e) => onChange('aboutText', e.target.value)}
            className={STANDARD_INPUT_FIELD}
            required
          />
          <p className="text-xs text-gray-500 text-right mt-1">{t('settingsCompanyProfile.aboutTextLength', { length: settings.aboutText?.length || 0 })}</p>
        </div>

        {/* VAT Number */}
        <label htmlFor="vatNumber" className="form-label md:pt-2">{t('settingsCompanyProfile.vatNumber')}</label>
        <div className="form-input-container">
          <input
            type="text"
            id="vatNumber"
            name="vatNumber"
            value={settings.vatNumber || ''}
            onChange={(e) => onChange('vatNumber', e.target.value)}
            className={STANDARD_INPUT_FIELD}
          />
        </div>

        {/* Regions Served (Cantons) */}
        <label className="form-label">{t('settingsCompanyProfile.regionsServed')} <span className="text-swiss-coral">*</span></label>
        <div className="form-input-container">
          <div className="p-2 border border-gray-300 rounded-md min-h-[40px] bg-white">
            {(settings.regionsServed || []).map(canton => (
                <span key={canton} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-swiss-teal/20 text-swiss-teal mr-1 mb-1">
                    {canton}
                    <button type="button" onClick={() => handleMultiSelectChange('regionsServed', canton)} className="ml-1 text-swiss-teal hover:text-opacity-70">✕</button>
                </span>
            ))}
         </div>
          <select 
            multiple={false} 
            onChange={(e) => handleMultiSelectChange('regionsServed', e.target.value)}
            value={""} 
            className={`${STANDARD_INPUT_FIELD} mt-1`}
          >
            <option value="" disabled>{t('settingsCompanyProfile.selectCanton')}</option>
            {SWISS_CANTONS.filter(c => !(settings.regionsServed || []).includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <p className="text-xs text-gray-500 mt-1">{t('settingsCompanyProfile.cantonsHelpText')}</p>
        </div>

        {/* Languages Spoken */}
        <label className="form-label">{t('settingsCompanyProfile.languagesSpoken')} <span className="text-swiss-coral">*</span></label>
        <div className="form-input-container">
            <div className="p-2 border border-gray-300 rounded-md min-h-[40px] bg-white">
                {((settings.languagesSpoken as SupportedLanguage[]) || []).map(lang => (
                    <span key={lang} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-swiss-teal/20 text-swiss-teal mr-1 mb-1">
                        {translatedLanguageOptions.find(o => o.value === lang)?.label || lang}
                        <button type="button" onClick={() => handleMultiSelectChange('languagesSpoken', lang)} className="ml-1 text-swiss-teal hover:text-opacity-70">✕</button>
                    </span>
                ))}
            </div>
             <select 
                multiple={false} 
                onChange={(e) => handleMultiSelectChange('languagesSpoken', e.target.value as SupportedLanguage)}
                value={""}
                className={`${STANDARD_INPUT_FIELD} mt-1`}
              >
                <option value="" disabled>{t('settingsCompanyProfile.selectLanguage')}</option>
                {translatedLanguageOptions.filter(opt => !(settings.languagesSpoken || []).includes(opt.value)).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          <p className="text-xs text-gray-500 mt-1">{t('settingsCompanyProfile.languagesHelpText')}</p>
        </div>
      </div>
    </SettingsSectionWrapper>
  );
};

export default CompanyProfileSettings;
