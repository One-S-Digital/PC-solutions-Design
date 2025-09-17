import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, ServerStackIcon, AdjustmentsHorizontalIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useAppContext } from 'packages/contexts/src/AppContext';
import { UserRole } from 'packages/core/src/types';

declare global {
  function toggleTheme(): void;
}

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAppContext();

  const navItems = [
    { path: '/dashboard', nameKey: 'sidebar.dashboard', icon: HomeIcon, roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
    { path: '/users/all', nameKey: 'sidebar.users', icon: UsersIcon, roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
    { path: '/system-monitoring', nameKey: 'sidebar.systemMonitoring', icon: ServerStackIcon, roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
    { path: '/platform-settings', nameKey: 'sidebar.platformSettings', icon: AdjustmentsHorizontalIcon, roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
  ];
  
  const userSpecificNavItems = navItems.filter(item => !item.roles || (currentUser && item.roles.includes(currentUser.role)));

  return (
    <aside className="w-64 flex-shrink-0 bg-surface-1 text-text-default flex flex-col border-r border-border">
      <div className="h-20 flex items-center px-6 border-b border-border">
        <div className="flex items-center brand">
            <div className="w-1.5 h-8 bg-accent rounded-full mr-3 card-accent"></div>
            <h1 className="text-xl font-bold text-text-strong">{t('appName')}</h1>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {userSpecificNavItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-sm rounded-md transition-colors font-medium
              ${isActive
                ? 'bg-accent/10 text-accent'
                : 'text-text-muted hover:bg-surface-3 hover:text-text-default'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {t(item.nameKey)}
          </NavLink>
        ))}
      </nav>
      <div className="p-5 border-t border-border mt-auto">
        {currentUser && (
          <div className="flex items-center mb-4">
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full mr-3" />
            <div>
              <p className="text-sm font-semibold text-text-strong">{currentUser.name}</p>
              <p className="text-xs text-text-subtle">{t(`userRoles.${currentUser.role}`)}</p>
            </div>
          </div>
        )}
        <button
          className="theme-toggle-btn w-full flex items-center justify-center p-2 rounded-md bg-surface-2 hover:bg-surface-3 text-text-muted"
          onClick={() => typeof toggleTheme === 'function' && toggleTheme()}
          aria-label="Toggle dark mode"
        >
          <SunIcon className="w-5 h-5 block dark:hidden" />
          <MoonIcon className="w-5 h-5 hidden dark:block" />
          <span className="ml-2 text-sm">Toggle Theme</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;