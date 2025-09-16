import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useNotifications } from '../contexts/NotificationContext';
import { UserRole, SettingsFormData, SupplierSettings, ProviderSettings, SupportedLanguage, SwissCanton } from '../types';
import { MOCK_SUPPLIER_SETTINGS, MOCK_PROVIDER_SETTINGS, SWISS_CANTONS } from '../constants';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import {
  CogIcon, UsersIcon, ShieldCheckIcon, EnvelopeIcon, BellIcon, LanguageIcon as GlobeIcon, DocumentTextIcon, CreditCardIcon, BuildingOfficeIcon,
  UserCircleIcon, PhoneIcon, BriefcaseIcon, PresentationChartLineIcon, LockClosedIcon, TagIcon, PaintBrushIcon, AdjustmentsHorizontalIcon, BellAlertIcon, WalletIcon, ChartPieIcon, EyeIcon, ShareIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

// Section specific components (to be created)
import CompanyProfileSettings from '../components/settings/sections/CompanyProfileSettings';
import ContactBookingSettings from '../components/settings/sections/ContactBookingSettings';
import NotificationPreferencesSettings from '../components/settings/sections/NotificationPreferencesSettings';
import DefaultsSettings from '../components/settings/sections/DefaultsSettings';
import PromoCodeManagerSettings from '../components/settings/sections/PromoCodeManagerSettings';
import BillingSubscriptionSettings from '../components/settings/sections/BillingSubscriptionSettings';
import AnalyticsPreferencesSettings from '../components/settings/sections/AnalyticsPreferencesSettings';
import TeamPermissionsSettings from '../components/settings/sections/TeamPermissionsSettings';
import PrivacyDataSettings from '../components/settings/sections/PrivacyDataSettings';


export interface SettingsSectionConfig {
  id: string;
  nameKey: string; // Changed from name to nameKey
  icon: React.ElementType;
  component: React.FC<{ settings: SettingsFormData; onChange: (field: keyof SettingsFormData, value: any) => void; userRole: UserRole }>;
  roles: UserRole[]; // Roles that can see this section
}

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAppContext();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SettingsFormData | null>(null);
  const [initialFormData, setInitialFormData] = useState<SettingsFormData | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [isDirty, setIsDirty] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (currentUser) {
      let initialSettings: SettingsFormData;
      if (currentUser.role === UserRole.PRODUCT_SUPPLIER) {
        initialSettings = MOCK_SUPPLIER_SETTINGS;
      } else if (currentUser.role === UserRole.SERVICE_PROVIDER) {
        initialSettings = MOCK_PROVIDER_SETTINGS;
      } else {
        navigate('/dashboard'); 
        return;
      }
      setFormData(JSON.parse(JSON.stringify(initialSettings))); 
      setInitialFormData(JSON.parse(JSON.stringify(initialSettings)));
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (formData && initialFormData) {
      setIsDirty(JSON.stringify(formData) !== JSON.stringify(initialFormData));
    } else {
      setIsDirty(false);
    }
  }, [formData, initialFormData]);

  const sections: SettingsSectionConfig[] = [
    { id: 'companyProfile', nameKey: 'settingsPage.companyProfile', icon: BuildingOfficeIcon, component: CompanyProfileSettings, roles: [UserRole.PRODUCT_SUPPLIER, UserRole.SERVICE_PROVIDER] },
    { id: 'contactBooking', nameKey: 'settingsPage.contactBooking', icon: PhoneIcon, component: ContactBookingSettings, roles: [UserRole.PRODUCT_SUPPLIER, UserRole.SERVICE_PROVIDER] },
    { id: 'notifications', nameKey: 'settingsPage.notificationPreferences', icon: BellAlertIcon, component: NotificationPreferencesSettings, roles: [UserRole.PRODUCT_SUPPLIER, UserRole.SERVICE_PROVIDER] },
    { id: 'defaults', nameKey: 'settingsPage.defaults', icon: AdjustmentsHorizontalIcon, component: DefaultsSettings, roles: [UserRole.PRODUCT_SUPPLIER, UserRole.SERVICE_PROVIDER] },
    { id: 'promoCodes', nameKey: 'settingsPage.promoCodeManager', icon: TagIcon, component: PromoCodeManagerSettings, roles: [UserRole.PRODUCT_SUPPLIER, UserRole.SERVICE_PROVIDER] },
    { id: 'billingSubscription', nameKey: 'settingsPage.billingSubscription', icon: WalletIcon, component: BillingSubscriptionSettings, roles: [UserRole.PRODUCT_SUPPLIER, UserRole.SERVICE_PROVIDER] },
    { id: 'analyticsPreferences', nameKey: 'settingsPage.analyticsPreferences', icon: ChartPieIcon, component: AnalyticsPreferencesSettings, roles: [UserRole.PRODUCT_SUPPLIER, UserRole.SERVICE_PROVIDER] },
    { id: 'teamPermissions', nameKey: 'settingsPage.teamPermissions', icon: UsersIcon, component: TeamPermissionsSettings, roles: [UserRole.PRODUCT_SUPPLIER, UserRole.SERVICE_PROVIDER] },
    { id: 'privacyData', nameKey: 'settingsPage.privacyData', icon: LockClosedIcon, component: PrivacyDataSettings, roles: [UserRole.PRODUCT_SUPPLIER, UserRole.SERVICE_PROVIDER] },
  ];
  
  const availableSections = sections.filter(s => currentUser && s.roles.includes(currentUser.role));

   useEffect(() => {
    if (availableSections.length > 0 && !activeSectionId) {
      setActiveSectionId(availableSections[0].id);
    }
  }, [availableSections, activeSectionId]);


  const handleFormChange = (field: keyof SettingsFormData, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = () => {
    console.log('Saving settings:', formData);
    setInitialFormData(JSON.parse(JSON.stringify(formData)));
    addNotification({ title: t('notifications.successTitle'), message: t('notifications.settingsUpdated'), type: 'success' });
    setIsDirty(false);
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm(t('settingsPage.unsavedChangesPrompt'))) {
        setFormData(JSON.parse(JSON.stringify(initialFormData))); 
        setIsDirty(false);
        navigate('/dashboard'); 
      }
    } else {
      navigate('/dashboard');
    }
  };
  
  const scrollToSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!currentUser || !formData) {
    return <div className="p-6 text-center">{t('settingsPage.loading')}</div>;
  }
  
  const userRole = currentUser.role;

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-30 bg-page-bg/80 backdrop-blur-md px-8 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-swiss-charcoal">{t('settingsPage.title')}</h1>
          <div className="flex space-x-3">
            <Button variant="light" onClick={handleCancel}>
              {t('buttons.cancel')}
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={!isDirty} className="bg-swiss-mint hover:bg-opacity-90">
              {t('buttons.saveChanges')}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-64 bg-white border-r border-gray-200 p-4 space-y-1 overflow-y-auto flex-shrink-0">
          {availableSections.map(section => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-left transition-colors
                ${activeSectionId === section.id 
                    ? 'bg-swiss-mint/10 text-swiss-mint' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-swiss-charcoal'
                }`}
              aria-current={activeSectionId === section.id ? 'page' : undefined}
            >
              <section.icon className={`w-5 h-5 mr-3 ${activeSectionId === section.id ? 'text-swiss-mint' : 'text-gray-400'}`} />
              {t(section.nameKey)}
            </button>
          ))}
        </nav>

        <main className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
          {availableSections.map(section => {
            const SectionComponent = section.component;
            return (
              <div key={section.id} id={section.id} ref={(el) => { sectionRefs.current[section.id] = el; }}>
                <SectionComponent settings={formData} onChange={handleFormChange} userRole={userRole} />
              </div>
            );
          })}
           {availableSections.length === 0 && (
            <Card className="p-6 text-center">
                <p className="text-gray-600">{t('settingsPage.noSectionsAvailable')}</p>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;