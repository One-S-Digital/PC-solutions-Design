
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { BuildingStorefrontIcon, ShoppingCartIcon, ClockIcon, TicketIcon, ListBulletIcon, ArrowTrendingUpIcon, LinkIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../../contexts/AppContext';
import Button from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';

interface DashboardTileProps {
  title: string;
  metric: string;
  actionText: string;
  onActionClick: () => void;
  icon: React.ElementType;
  color: string;
  hoverText?: string;
}

const DashboardTile: React.FC<DashboardTileProps> = ({ title, metric, actionText, onActionClick, icon: Icon, color, hoverText }) => (
  <Card className="p-0 overflow-hidden group" hoverEffect>
    <div className="p-5">
      <div className="flex justify-between items-start">
        <div className={`p-2.5 inline-flex rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        {hoverText && (
          <div className="relative">
            <ClockIcon className="h-5 w-5 text-gray-400 cursor-pointer peer" />
            <div className="absolute hidden peer-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded-md shadow-lg whitespace-nowrap">
              {hoverText}
            </div>
          </div>
        )}
      </div>
      <h3 className="text-3xl font-semibold text-swiss-charcoal mt-3">{metric}</h3>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
    <button
      onClick={onActionClick}
      className={`block w-full px-5 py-2.5 text-xs text-center font-medium bg-${color}-50 text-${color}-600 hover:bg-${color}-100 transition-colors duration-150`}
      aria-label={`View details for ${title}`}
    >
      {actionText} &rarr;
    </button>
  </Card>
);


const SupplierDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAppContext();

  const tiles = [
    { title: t('supplierDashboard.tiles.activeProducts'), metric: '125', actionText: t('supplierDashboard.tiles.viewProductListings'), onActionClick: () => navigate('/supplier/product-listings'), icon: BuildingStorefrontIcon, color: 'swiss-mint' },
    { title: t('supplierDashboard.tiles.newOrderRequests'), metric: '12', actionText: t('supplierDashboard.tiles.viewOrdersNew'), onActionClick: () => navigate('/supplier/orders?status=New'), icon: ShoppingCartIcon, color: 'swiss-sand' },
    { title: t('supplierDashboard.tiles.avgResponseTime'), metric: '2h 35m', actionText: t('supplierDashboard.tiles.viewSLATrend'), onActionClick: () => alert('SLA Trend View (TBD)'), icon: ClockIcon, color: 'swiss-teal', hoverText: t('supplierDashboard.tiles.last30Days') },
    { title: t('supplierDashboard.tiles.promoRedemptions'), metric: '78', actionText: t('supplierDashboard.tiles.viewAnalytics'), onActionClick: () => navigate('/supplier/analytics'), icon: TicketIcon, color: 'swiss-coral' },
  ];
  
  // Mock data for panels
  const recentOrders = [
    { id: 'ORD001', creche: 'Happy Kids Daycare', product: 'Wooden Blocks Set', qty: 5, date: '2024-07-28', status: 'New' },
    { id: 'ORD002', creche: 'Sunshine Creche', product: 'Organic Apple Puree', qty: 20, date: '2024-07-28', status: 'Accepted' },
    { id: 'ORD003', creche: 'Little Explorers', product: 'Nap Mats (Pack of 10)', qty: 2, date: '2024-07-27', status: 'Shipped' },
    { id: 'ORD004', creche: 'Tiny Tots Academy', product: 'Safety Gates', qty: 3, date: '2024-07-26', status: 'Fulfilled' },
    { id: 'ORD005', creche: 'Bright Futures', product: 'Art Supplies Bundle', qty: 1, date: '2024-07-25', status: 'New' },
  ];

  const activityFeed = [
    { id: 'act1', text: t('supplierDashboard.activity.newOrder', { orderId: '#ORD005', foundationName: 'Bright Futures' }), time: t('supplierDashboard.time.minutesAgo', { count: 10 }) },
    { id: 'act2', text: t('supplierDashboard.activity.productApproved', { productName: 'Eco-Friendly Crayons'}), time: t('supplierDashboard.time.hoursAgo', {count: 1}) },
    { id: 'act3', text: t('supplierDashboard.activity.promoUsed', { promoCode: 'SUMMER20', foundationName: 'Happy Kids Daycare'}), time: t('supplierDashboard.time.hoursAgo', {count: 3}) },
    { id: 'act4', text: t('supplierDashboard.activity.listingPaused', { productName: 'Old Model Playpen'}), time: t('supplierDashboard.time.yesterday') },
  ];


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-swiss-charcoal">
          {t('supplierDashboard.title')}
        </h1>
        <p className="text-gray-500 mt-1">{t('supplierDashboard.welcomeMessage', { name: currentUser?.name?.split(' ')[0] })}</p>
      </div>

      <Card className="p-6 bg-swiss-sand/10 border border-swiss-sand/30">
        <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
                <h2 className="text-xl font-semibold text-amber-800">{t('supplierDashboard.directOrderLink.title')}</h2>
                <p className="text-sm text-amber-700 mt-1">{t('supplierDashboard.directOrderLink.description')}</p>
            </div>
            <Button 
                variant="secondary" 
                className="mt-3 sm:mt-0 bg-amber-600 hover:bg-amber-700 text-white"
                leftIcon={LinkIcon}
                onClick={() => navigate('/settings')}
            >
                {t('supplierDashboard.directOrderLink.button')}
            </Button>
        </div>
      </Card>

      <section>
        <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">{t('supplierDashboard.snapshotTitle')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiles.map(tile => (
            <DashboardTile
              key={tile.title}
              title={tile.title}
              metric={tile.metric}
              actionText={tile.actionText}
              onActionClick={tile.onActionClick}
              icon={tile.icon}
              color={tile.color.replace('swiss-','') } // Adjusting for Tailwind convention if colors are directly 'mint', 'sand'
              hoverText={tile.hoverText}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">{t('supplierDashboard.recentOrdersTitle')}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[t('supplierDashboard.recentOrdersTable.id'), t('supplierDashboard.recentOrdersTable.creche'), t('supplierDashboard.recentOrdersTable.product'), t('supplierDashboard.recentOrdersTable.qty'), t('supplierDashboard.recentOrdersTable.date'), t('supplierDashboard.recentOrdersTable.status'), t('supplierDashboard.recentOrdersTable.actions')].map(header => (
                      <th key={header} scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">{order.id}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{order.creche}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{order.product}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{order.qty}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{order.date}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'New' ? 'bg-swiss-coral/20 text-swiss-coral' :
                          order.status === 'Accepted' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                          order.status === 'Fulfilled' ? 'bg-swiss-mint/20 text-swiss-mint' : ''
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {order.status === 'New' && (
                          <>
                            <button className="text-swiss-mint hover:underline mr-2 text-xs" onClick={() => alert(`Accept order ${order.id} TBD`)}>{t('supplierDashboard.recentOrdersActions.accept')}</button>
                            <button className="text-swiss-coral hover:underline text-xs" onClick={() => alert(`Decline order ${order.id} TBD`)}>{t('supplierDashboard.recentOrdersActions.decline')}</button>
                          </>
                        )}
                         {order.status !== 'New' && (
                            <button className="text-gray-500 hover:underline text-xs" onClick={() => alert(`View order ${order.id} TBD`)}>{t('buttons.view')}</button>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {recentOrders.length === 0 && <p className="text-center text-gray-500 py-4">{t('supplierDashboard.noRecentOrders')}</p>}
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
                    <p className="text-gray-700">{activity.text}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
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

export default SupplierDashboardPage;