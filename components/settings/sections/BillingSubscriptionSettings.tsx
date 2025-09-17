

// Implement BillingSubscriptionSettings.tsx
// Placeholder - This will be implemented in subsequent steps.
import React from 'react';
import { SettingsFormData, UserRole } from '../../../types';
import SettingsSectionWrapper from '../SettingsSectionWrapper';
import Button from '../../ui/Button';
import { WalletIcon, CreditCardIcon, CalendarDaysIcon, ArrowPathIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
// import ConfirmDestructiveActionModal from '../ConfirmDestructiveActionModal'; // To be created

interface BillingSubscriptionSettingsProps {
  settings: SettingsFormData;
  onChange: (field: keyof SettingsFormData, value: any) => void;
  userRole: UserRole;
}

const BillingSubscriptionSettings: React.FC<BillingSubscriptionSettingsProps> = ({ settings, onChange, userRole }) => {
  const { t } = useTranslation();
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  
  const handleCancelPlan = () => {
    // Logic to cancel plan
    console.log("Plan cancellation initiated.");
    setIsCancelModalOpen(false);
    alert(t("settingsBillingSubscription.confirmCancelMessage")); // Using message as alert for demo
    // Potentially update settings.currentTier to 'Cancelled' or similar
  };

  return (
    <SettingsSectionWrapper title={t('settingsPage.billingSubscription')} icon={WalletIcon}>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-md font-medium text-gray-700">{t('settingsBillingSubscription.currentPlan')}</h3>
          <p className="text-2xl font-semibold text-swiss-mint mt-1">{settings.currentTier || 'N/A'}</p>
          {settings.nextInvoiceDate && (
            <p className="text-sm text-gray-500 mt-0.5">
              {t('settingsBillingSubscription.nextInvoiceOn', { date: new Date(settings.nextInvoiceDate).toLocaleDateString() })}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-form-layout gap-x-6 gap-y-4 items-center">
            <label className="form-label">{t('settingsBillingSubscription.managePaymentMethod')}</label>
            <div className="form-input-container">
                <Button 
                    variant="outline" 
                    leftIcon={CreditCardIcon} 
                    onClick={() => window.open(settings.stripePortalLink || '#', '_blank')}
                    disabled={!settings.stripePortalLink}
                >
                    {t('settingsBillingSubscription.managePaymentMethod')}
                </Button>
                 {!settings.stripePortalLink && <p className="text-xs text-gray-400 mt-1">{t('settingsBillingSubscription.stripePortalLinkNotConfigured')}</p>}
            </div>

            <label className="form-label">{t('settingsBillingSubscription.cancelSubscription')}</label>
            <div className="form-input-container">
                <Button 
                    variant="danger" 
                    leftIcon={XCircleIcon}
                    onClick={() => setIsCancelModalOpen(true)}
                >
                    {t('settingsBillingSubscription.cancelSubscription')}
                </Button>
            </div>
        </div>
      </div>
      
      {/* <ConfirmDestructiveActionModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelPlan}
        title="Cancel Subscription"
        message="Are you sure you want to cancel your subscription? This action cannot be undone and may result in loss of access to premium features at the end of your current billing cycle."
        confirmButtonText="Yes, Cancel Subscription"
      /> */}
       {isCancelModalOpen && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                  <h3 className="text-lg font-semibold mb-2 text-swiss-coral">{t('settingsBillingSubscription.confirmCancelTitle')}</h3>
                  <p className="text-sm text-gray-600 mb-4">{t('settingsBillingSubscription.confirmCancelMessage')}</p>
                  <div className="flex justify-end space-x-2">
                      <Button variant="light" onClick={() => setIsCancelModalOpen(false)}>{t('settingsBillingSubscription.keepSubscription')}</Button>
                      <Button variant="danger" onClick={handleCancelPlan}>{t('settingsBillingSubscription.yesCancel')}</Button>
                  </div>
              </div>
          </div>
      )}
    </SettingsSectionWrapper>
  );
};

export default BillingSubscriptionSettings;