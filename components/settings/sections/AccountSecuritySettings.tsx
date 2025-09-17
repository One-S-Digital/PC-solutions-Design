import React, { useState } from 'react';
import { SettingsFormData, UserRole } from '../../../types';
import { STANDARD_INPUT_FIELD } from '../../../constants';
import SettingsSectionWrapper from '../SettingsSectionWrapper';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import Button from '../../ui/Button';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../contexts/AppContext';
import { useNotifications } from '../../../contexts/NotificationContext';

interface AccountSecuritySettingsProps {
  settings: SettingsFormData;
  onChange: (field: keyof SettingsFormData, value: any) => void;
  userRole: UserRole;
}

const AccountSecuritySettings: React.FC<AccountSecuritySettingsProps> = ({ settings, onChange, userRole }) => {
  const { t } = useTranslation();
  const { currentUser, updateCurrentUserInfo } = useAppContext();
  const { addNotification } = useNotifications();
  
  const [personalInfo, setPersonalInfo] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || ''
  });
  
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserInfo({ name: personalInfo.name, email: personalInfo.email });
    addNotification({ title: t('settingsAccountSecurity.notifications.infoUpdated'), message: '', type: 'success' });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInfo.newPassword !== passwordInfo.confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
    if (passwordInfo.newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }
    console.log("Updating password..."); // Mock action
    addNotification({ title: t('settingsAccountSecurity.notifications.passwordChanged'), message: '', type: 'success' });
    setPasswordInfo({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };
  
  return (
    <SettingsSectionWrapper title={t('settingsPage.accountSecurity')} icon={UserCircleIcon}>
      <div className="space-y-8">
        {/* Personal Information Section */}
        <form onSubmit={handleUpdateInfo}>
          <h3 className="text-lg font-medium text-gray-900">{t('settingsAccountSecurity.personalInfo.title')}</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-form-layout gap-x-6 gap-y-4 items-start">
            <label htmlFor="name" className="form-label md:pt-2">{t('settingsAccountSecurity.personalInfo.nameLabel')}</label>
            <div className="form-input-container">
              <input type="text" id="name" name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} className={STANDARD_INPUT_FIELD} />
            </div>
            
            <label htmlFor="email" className="form-label md:pt-2">{t('settingsAccountSecurity.personalInfo.emailLabel')}</label>
            <div className="form-input-container">
              <input type="email" id="email" name="email" value={personalInfo.email} onChange={handlePersonalInfoChange} className={STANDARD_INPUT_FIELD} />
            </div>
          </div>
           <div className="mt-4">
             <Button type="submit" variant="secondary">{t('settingsAccountSecurity.personalInfo.updateInfoButton')}</Button>
           </div>
        </form>

        <hr />

        {/* Change Password Section */}
        <form onSubmit={handleUpdatePassword}>
          <h3 className="text-lg font-medium text-gray-900">{t('settingsAccountSecurity.changePassword.title')}</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-form-layout gap-x-6 gap-y-4 items-start">
             <label htmlFor="currentPassword" className="form-label md:pt-2">{t('settingsAccountSecurity.changePassword.currentPasswordLabel')}</label>
            <div className="form-input-container">
              <input type="password" id="currentPassword" name="currentPassword" value={passwordInfo.currentPassword} onChange={handlePasswordChange} className={STANDARD_INPUT_FIELD} />
            </div>
            
            <label htmlFor="newPassword" className="form-label md:pt-2">{t('settingsAccountSecurity.changePassword.newPasswordLabel')}</label>
            <div className="form-input-container">
              <input type="password" id="newPassword" name="newPassword" value={passwordInfo.newPassword} onChange={handlePasswordChange} className={STANDARD_INPUT_FIELD} />
            </div>
            
            <label htmlFor="confirmNewPassword" className="form-label md:pt-2">{t('settingsAccountSecurity.changePassword.confirmNewPasswordLabel')}</label>
            <div className="form-input-container">
              <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={passwordInfo.confirmNewPassword} onChange={handlePasswordChange} className={STANDARD_INPUT_FIELD} />
            </div>
          </div>
          <div className="mt-4">
             <Button type="submit" variant="secondary">{t('settingsAccountSecurity.changePassword.updatePasswordButton')}</Button>
           </div>
        </form>
      </div>
    </SettingsSectionWrapper>
  );
};

export default AccountSecuritySettings;