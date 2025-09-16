
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { WrenchScrewdriverIcon, InboxArrowDownIcon, ClockIcon, TicketIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';

interface DashboardTileProps {
  titleKey: string; // Key for title
  metric: string;
  actionTextKey: string; // Key for action text
  onActionClick: () => void;
  icon: React.ElementType;
  color: string;
  hoverTextKey?: string; // Key for hover text
}

const DashboardTile: React.FC<DashboardTileProps> = ({ titleKey, metric, actionTextKey, onActionClick, icon: Icon, color, hoverTextKey }) => {
  const { t } = useTranslation();
  return (
    <Card className="p-0 overflow-hidden group" hoverEffect>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className={`p-2.5 inline-flex rounded-lg bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          {hoverTextKey && (
            <div className="relative">
              <ClockIcon className="h-5 w-5 text-gray-400 cursor-pointer peer" />
              <div className="absolute hidden peer-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded-md shadow-lg whitespace-nowrap">
                {t(hoverTextKey)}
              </div>
            </div>
          )}
        </div>
        <h3 className="text-3xl font-semibold text-swiss-charcoal mt-3">{metric}</h3>
        <p className="text-sm text-gray-500">{t(titleKey)}</p>
      </div>
      <button
        onClick={onActionClick}
        className={`block w-full px-5 py-2.5 text-xs text-center font-medium bg-${color}-50 text-${color}-600 hover:bg-${color}-100 transition-colors duration-150`}
        aria-label={t('dashboardPage.viewDetailsFor', { name: t(titleKey)})}
      >
        {t(actionTextKey)} &rarr;
      </button>
    </Card>
  );
};

const ServiceProviderDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAppContext();

  const tiles = [
    { titleKey: 'serviceProviderDashboard.tiles.activeServices', metric: '8', actionTextKey: 'serviceProviderDashboard.tiles.viewServiceListings', onActionClick: () => navigate('/service-provider/service-listings'), icon: WrenchScrewdriverIcon, color: 'swiss-mint' },
    { titleKey: 'serviceProviderDashboard.tiles.newRequests', metric: '5', actionTextKey: 'serviceProviderDashboard.tiles.viewRequestsNew', onActionClick: () => navigate('/service-provider/requests?status=New'), icon: InboxArrowDownIcon, color: 'swiss-sand' },
    { titleKey: 'serviceProviderDashboard.tiles.avgResponseTime', metric: '1h 15m', actionTextKey: 'serviceProviderDashboard.tiles.viewSLATrend', onActionClick: () => alert(t('serviceProviderDashboard.slaTrendAlert')), icon: ClockIcon, color: 'swiss-teal', hoverTextKey: 'supplierDashboard.tiles.last30Days' },
    { titleKey: 'serviceProviderDashboard.tiles.promoRedemptions', metric: '23', actionTextKey: 'supplierDashboard.tiles.viewAnalytics', onActionClick: () => navigate('/service-provider/analytics'), icon: TicketIcon, color: 'swiss-coral' },
  ];

  const recentRequests = [
    { id: 'REQ001', creche: 'KinderWelt Vaud', service: 'Deep Cleaning Service', date: '2024-07-29', status: 'New' },
    { id: 'REQ002', creche: 'Happy Sunshine Daycare', service: 'Legal Consultation', date: '2024-07-28', status: 'Accepted' },
    { id: 'REQ003', creche: 'Little Stars Creche', service: 'Pedagogy Workshop', date: '2024-07-27', status: 'Completed' },
  ];

  const activityFeed = [
    { id: 'act1_sp', textKey: 'serviceProviderDashboard.activity.newRequest', params: { requestId: '#REQ001', foundationName: 'KinderWelt Vaud' }, timeKey: 'messagesPage.time.minutesAgo', timeParams: { count: 5 } },
    { id: 'act2_sp', textKey: 'serviceProviderDashboard.activity.serviceCompleted', params: { serviceName: 'Photography Session', foundationName: 'Happy Sunshine Daycare' }, timeKey: 'messagesPage.time.hoursAgo', timeParams: { count: 2 } },
    { id: 'act3_sp', textKey: 'serviceProviderDashboard.activity.promoUsed', params: { promoCode: 'NEWCLIENT15', foundationName: 'Little Stars Creche' }, timeKey: 'messagesPage.time.yesterday', timeParams: {} },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-swiss-charcoal">
          {t('serviceProviderDashboard.title')}
        </h1>
        <p className="text-gray-500 mt-1">{t('serviceProviderDashboard.welcomeMessage', { name: currentUser?.name?.split(' ')[0] })}</p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">{t('supplierDashboard.snapshotTitle')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiles.map(tile => (
            <DashboardTile
              key={tile.titleKey}
              titleKey={tile.titleKey}
              metric={tile.metric}
              actionTextKey={tile.actionTextKey}
              onActionClick={tile.onActionClick}
              icon={tile.icon}
              color={tile.color.replace('swiss-','')}
              hoverTextKey={tile.hoverTextKey}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">{t('serviceProviderDashboard.recentRequestsTitle')}</h2>
             <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[t('serviceProviderDashboard.table.id'), t('serviceProviderDashboard.table.creche'), t('serviceProviderDashboard.table.service'), t('serviceProviderDashboard.table.date'), t('serviceProviderDashboard.table.status'), t('serviceProviderDashboard.table.actions')].map(header => (
                      <th key={header} scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentRequests.map(req => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">{req.id}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{req.creche}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{req.service}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{req.date}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          req.status === 'New' ? 'bg-swiss-coral/20 text-swiss-coral' :
                          req.status === 'Accepted' ? 'bg-swiss-mint/20 text-swiss-mint' :
                          req.status === 'Completed' ? 'bg-swiss-teal/20 text-swiss-teal' : ''
                        }`}>
                          {t(`serviceProviderDashboard.status.${req.status.toLowerCase()}` as const, req.status)}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {req.status === 'New' && (
                          <>
                            <button className="text-swiss-mint hover:underline mr-2 text-xs" onClick={() => alert(t('serviceProviderDashboard.acceptRequestAlert', { requestId: req.id }))}>{t('supplierDashboard.recentOrdersActions.accept')}</button>
                            <button className="text-swiss-coral hover:underline text-xs" onClick={() => alert(t('serviceProviderDashboard.declineRequestAlert', { requestId: req.id }))}>{t('supplierDashboard.recentOrdersActions.decline')}</button>
                          </>
                        )}
                         {req.status !== 'New' && (
                            <button className="text-gray-500 hover:underline text-xs" onClick={() => alert(t('serviceProviderDashboard.viewRequestAlert', { requestId: req.id }))}>{t('buttons.view')}</button>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {recentRequests.length === 0 && <p className="text-center text-gray-500 py-4">{t('serviceProviderDashboard.noRecentRequests')}</p>}
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">{t('supplierDashboard.activityFeedTitle')}</h2>
             <ul className="space-y-3">
              {activityFeed.map(activity => (
                <li key={activity.id} className="flex items-start text-sm">
                  <ListBulletIcon className="w-4 h-4 text-gray-400 mr-2.5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700">{t(activity.textKey, activity.params)}</p>
                    <p className="text-xs text-gray-400">{t(activity.timeKey, activity.timeParams)}</p>
                  </div>
                </li>
              ))}
            </ul>
            {activityFeed.length === 0 && <p className="text-center text-gray-500 py-4">{t('supplierDashboard.noRecentActivity')}</p>}
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ServiceProviderDashboardPage;
