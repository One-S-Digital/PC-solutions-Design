
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { InboxArrowDownIcon, ShoppingCartIcon, BriefcaseIcon, AcademicCapIcon, CalendarDaysIcon, ListBulletIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';

interface DashboardTileProps {
  titleKey: string;
  metric: string;
  actionTextKey: string;
  onActionClick: () => void;
  icon: React.ElementType;
  color: string; // Expects full color name like 'swiss-mint'
  hoverTextKey?: string;
}

const DashboardTile: React.FC<DashboardTileProps> = ({ titleKey, metric, actionTextKey, onActionClick, icon: Icon, color, hoverTextKey }) => {
  const { t } = useTranslation();
  return (
    <Card className="p-0 overflow-hidden group" hoverEffect>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className={`p-2.5 inline-flex rounded-lg bg-${color}/10`}> {/* Use opacity modifier */}
            <Icon className={`h-6 w-6 text-${color}`} /> {/* Use direct color */}
          </div>
          {hoverTextKey && (
            <div className="relative">
              <UsersIcon className="h-5 w-5 text-gray-400 cursor-pointer peer" /> {/* Using UsersIcon for hover info consistency */}
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
        className={`block w-full px-5 py-2.5 text-xs text-center font-medium bg-${color}/[0.07] text-${color} hover:bg-${color}/[0.15] transition-colors duration-150`} // Use opacity modifier for button background
        aria-label={t('dashboardPage.viewDetailsFor', { name: t(titleKey) })}
      >
        {t(actionTextKey)} &rarr;
      </button>
    </Card>
  );
};

const FoundationDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAppContext();

  const tiles = [
    { titleKey: 'foundationDashboard.tiles.openLeads', metric: '7', actionTextKey: 'foundationDashboard.tiles.viewParentLeadsNew', onActionClick: () => navigate('/foundation/leads?status=New'), icon: InboxArrowDownIcon, color: 'swiss-mint' },
    { titleKey: 'foundationDashboard.tiles.pendingOrders', metric: '3', actionTextKey: 'foundationDashboard.tiles.viewOrdersPending', onActionClick: () => navigate('/foundation/orders-appointments?tab=orders&status=Pending'), icon: ShoppingCartIcon, color: 'swiss-sand' },
    { titleKey: 'foundationDashboard.tiles.openPositions', metric: '2', actionTextKey: 'foundationDashboard.tiles.viewRecruitmentListings', onActionClick: () => navigate('/recruitment'), icon: BriefcaseIcon, color: 'swiss-teal' },
    { titleKey: 'foundationDashboard.tiles.trainingProgress', metric: '85%', actionTextKey: 'foundationDashboard.tiles.viewOverdueStaff', onActionClick: () => navigate('/e-learning?filter=overdue'), icon: AcademicCapIcon, color: 'swiss-coral', hoverTextKey: 'foundationDashboard.tiles.trainingProgressHover' },
  ];

  const todaysSchedule = [
    { time: '09:00', eventKey: 'foundationDashboard.schedule.supplierDelivery', type: 'delivery' },
    { time: '10:30', eventKey: 'foundationDashboard.schedule.serviceAppointment', type: 'service' },
    { time: '14:00', eventKey: 'foundationDashboard.schedule.staffTraining', type: 'training' },
  ];

  const activityFeed = [
    { id: 'act_f1', textKey: 'foundationDashboard.activity.newLead', params: { name: 'S. Dubois' }, timeKey: 'messagesPage.time.minutesAgo', timeParams: { count: 20 } },
    { id: 'act_f2', textKey: 'foundationDashboard.activity.orderAccepted', params: { orderId: '#P0124', productName: 'Wooden Blocks', supplierName: 'EcoToys' }, timeKey: 'messagesPage.time.hoursAgo', timeParams: { count: 1 } },
    { id: 'act_f3', textKey: 'foundationDashboard.activity.candidateApplied', params: { candidateName: 'J. Miller', jobTitle: 'Lead Educator' }, timeKey: 'messagesPage.time.hoursAgo', timeParams: { count: 2 } },
    { id: 'act_f4', textKey: 'foundationDashboard.activity.policyUploaded', params: { policyName: 'Child Safety Protocols v2.1', uploaderName: 'Admin' }, timeKey: 'messagesPage.time.yesterday', timeParams: {} },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-swiss-charcoal">
          {t('foundationDashboard.title')}
        </h1>
        <p className="text-gray-500 mt-1">{t('foundationDashboard.welcomeMessage', { name: currentUser?.name?.split(' ')[0] })}</p>
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
              color={tile.color} // Pass the full color name
              hoverTextKey={tile.hoverTextKey}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
           <Card className="p-6 h-full"> {/* Added h-full for consistent height */}
            <h2 className="text-xl font-semibold text-swiss-charcoal mb-4 flex items-center">
                <CalendarDaysIcon className="w-6 h-6 mr-2 text-swiss-teal"/>
                {t('foundationDashboard.todaysScheduleTitle')}
            </h2>
            <ul className="space-y-3">
              {todaysSchedule.map(item => (
                <li key={item.time + item.eventKey} className="flex items-center text-sm">
                  <span className={`w-2 h-2 rounded-full mr-2.5 ${item.type === 'delivery' ? 'bg-swiss-sand' : item.type === 'service' ? 'bg-swiss-mint' : 'bg-swiss-coral'}`}></span>
                  <span className="font-medium text-gray-500 mr-2">{item.time}</span>
                  <span className="text-gray-700">{t(item.eventKey)}</span>
                </li>
              ))}
            </ul>
            {todaysSchedule.length === 0 && <p className="text-center text-gray-500 py-4">{t('foundationDashboard.noScheduleItems')}</p>}
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-6 h-full"> {/* Added h-full */}
            <h2 className="text-xl font-semibold text-swiss-charcoal mb-4 flex items-center">
                <ListBulletIcon className="w-6 h-6 mr-2 text-swiss-mint"/>
                {t('supplierDashboard.activityFeedTitle')}
            </h2>
            <ul className="space-y-3">
              {activityFeed.map(activity => (
                <li key={activity.id} className="flex items-start text-sm">
                  <div className={`w-1.5 h-1.5 rounded-full mr-2.5 mt-1.5 flex-shrink-0 ${
                      activity.textKey.includes('lead') ? 'bg-swiss-mint' :
                      activity.textKey.includes('Order') || activity.textKey.includes('EcoToys') ? 'bg-swiss-sand' :
                      activity.textKey.includes('Candidate') ? 'bg-swiss-teal' :
                      activity.textKey.includes('Policy') ? 'bg-swiss-coral' : 'bg-gray-400'
                  }`}></div>
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

export default FoundationDashboardPage;
