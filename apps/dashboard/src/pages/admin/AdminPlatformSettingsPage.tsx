import React, { useState } from 'react';
import { useAppContext } from 'packages/contexts/src/AppContext';
import Button from 'packages/ui/src/components/Button';
import { AdjustmentsHorizontalIcon, GlobeAltIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const AdminPlatformSettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { platformSettings, setPlatformSettings } = useAppContext();
  const [formData, setFormData] = useState(platformSettings);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlatformSettings(formData);
    setIsSaved(true);
    console.log("Saving platform settings:", formData);
  };
  
  const inputClass = "bg-surface-2 border border-border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-accent";
  const fileInputClass = `${inputClass} p-0 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-surface-3 file:text-text-default hover:file:bg-surface-3/80`;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-text-strong flex items-center">
        <AdjustmentsHorizontalIcon className="w-8 h-8 mr-3 text-accent" />
        {t('adminPlatformSettings.title')}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface-1 p-6 rounded-lg shadow-soft card-accent">
          {isSaved && (
            <div className="mb-4 p-3 bg-success/10 text-success rounded-md text-sm">
              Settings saved successfully!
            </div>
          )}
          
          <h2 className="text-xl font-semibold text-text-strong mb-4 flex items-center">
            <GlobeAltIcon className="w-6 h-6 mr-2 text-accent" />
            {t('adminPlatformSettings.general.title')}
          </h2>
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="platformName" className="block text-sm font-medium text-text-muted mb-1">{t('adminPlatformSettings.general.nameLabel')}</label>
              <input type="text" id="platformName" name="platformName" value={formData.platformName} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor="metadataDescription" className="block text-sm font-medium text-text-muted mb-1">{t('adminPlatformSettings.general.descriptionLabel')}</label>
              <textarea id="metadataDescription" name="metadataDescription" value={formData.metadataDescription} onChange={handleChange} rows={3} className={inputClass} />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-text-strong mb-4 flex items-center">
            <PhotoIcon className="w-6 h-6 mr-2 text-accent" />
            {t('adminPlatformSettings.branding.title')}
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-text-muted mb-1">{t('adminPlatformSettings.branding.logoLabel')}</label>
              <input type="file" id="logoUrl" className={fileInputClass} />
            </div>
            <div>
              <label htmlFor="faviconUrl" className="block text-sm font-medium text-text-muted mb-1">{t('adminPlatformSettings.branding.faviconLabel')}</label>
              <input type="file" id="faviconUrl" className={fileInputClass} />
            </div>
          </div>
          
        </div>
         <div className="flex justify-end">
            <Button type="submit" variant="secondary">{t('buttons.saveChanges')}</Button>
          </div>
      </form>
    </div>
  );
};

export default AdminPlatformSettingsPage;