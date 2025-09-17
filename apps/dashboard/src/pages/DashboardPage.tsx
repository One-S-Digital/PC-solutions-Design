import React from 'react';
import { useAppContext } from 'packages/contexts/src/AppContext';
import { ExclamationTriangleIcon, UsersIcon, BanknotesIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { MOCK_CONTENT_QUEUE, MOCK_POLICY_DOCS, MOCK_COURSES } from 'packages/core/src/constants';
import Button from 'packages/ui/src/components/Button';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAppContext();

  const statusFlags = [
    { name: "Draft Policies", count: MOCK_POLICY_DOCS.filter(p => p.status === 'Draft').length, icon: ExclamationTriangleIcon, color: "text-text-muted" },
    { name: "Critical Live Policies", count: MOCK_POLICY_DOCS.filter(p => p.status === 'Published' && p.isCritical).length, icon: ExclamationTriangleIcon, color: "text-danger" },
    { name: "Content Needing FR Translation", count: MOCK_COURSES.filter(c => c.language !== 'FR').length, icon: ExclamationTriangleIcon, color: "text-warn" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-strong">
          {t('dashboardPage.welcome', { name: currentUser?.name.split(' ')[0] || 'Admin' })}
        </h1>
        <p className="text-text-muted mt-1">{t('dashboardPage.overviewSubtitle', { appName: t('appName') })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface-1 p-6 rounded-lg shadow-soft lift">
            <UsersIcon className="w-8 h-8 text-info mb-2" />
            <p className="text-sm text-text-muted">Total Users</p>
            <p className="text-3xl font-bold text-text-strong">1,234</p>
        </div>
        <div className="bg-surface-1 p-6 rounded-lg shadow-soft lift">
            <BanknotesIcon className="w-8 h-8 text-success mb-2" />
            <p className="text-sm text-text-muted">Revenue (Month)</p>
            <p className="text-3xl font-bold text-text-strong">CHF 12,450</p>
        </div>
         <div className="bg-surface-1 p-6 rounded-lg shadow-soft lift">
            <CircleStackIcon className="w-8 h-8 text-warn mb-2" />
            <p className="text-sm text-text-muted">System Health</p>
            <p className="text-3xl font-bold text-success">Normal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-1 p-6 rounded-lg shadow-soft card-accent">
          <h2 className="text-xl font-semibold text-text-strong mb-4">{t('adminContentDashboard.contentModeration.title')}</h2>
           {MOCK_CONTENT_QUEUE.length === 0 ? <p className="text-text-muted">{t('adminContentDashboard.contentModeration.empty')}</p> : (
            <ul className="space-y-3">
              {MOCK_CONTENT_QUEUE.map(item => (
                <li key={item.id} className="flex items-center justify-between p-3 rounded-md bg-surface-2">
                  <div>
                    <p className="font-medium text-text-default">{item.title}</p>
                    <p className="text-xs text-text-subtle">{item.type} by {item.authorName}</p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="xs">{t('adminContentDashboard.contentModeration.reject')}</Button>
                    <Button variant="primary" size="xs">{t('adminContentDashboard.contentModeration.approve')}</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="bg-surface-1 p-6 rounded-lg shadow-soft notch-tr">
            <h2 className="text-xl font-semibold text-text-strong mb-4">Content Status Flags</h2>
            <ul className="space-y-3">
                {statusFlags.map(flag => (
                    <li key={flag.name} className="flex items-center p-2 -m-2 rounded-md hover:bg-surface-2">
                        <flag.icon className={`w-5 h-5 mr-2.5 ${flag.color}`} />
                        <span className="text-sm text-text-default">{flag.name}:</span>
                        <span className="text-sm font-semibold text-text-strong ml-1.5">{flag.count}</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;