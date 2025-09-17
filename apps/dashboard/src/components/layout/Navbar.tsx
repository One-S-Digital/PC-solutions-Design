import React from 'react';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useAppContext } from 'packages/contexts/src/AppContext';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from 'packages/ui/src/components/LanguageSwitcher';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-20 bg-surface-1 border-b border-border flex items-center justify-between px-8">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-subtle" />
        <input
          type="text"
          placeholder={t('navbar.searchPlaceholder')}
          className="bg-surface-2 border border-border rounded-md pl-10 pr-4 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <div className="flex items-center space-x-5">
        <LanguageSwitcher />
        <button className="relative text-text-muted hover:text-text-default">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger ring-2 ring-surface-1"></span>
        </button>
        {currentUser && (
          <button onClick={handleLogout} className="text-sm font-medium text-text-muted hover:text-danger">
            {t('buttons.signOut')}
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;