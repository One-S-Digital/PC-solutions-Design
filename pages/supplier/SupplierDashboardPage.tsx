
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { BuildingStorefrontIcon, ShoppingCartIcon, ClockIcon, TicketIcon, ListBulletIcon, ArrowTrendingUpIcon, LinkIcon, PlusCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../../contexts/AppContext';
import Button from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';

const SupplierDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAppContext();

  // Mock data for widgets
  const salesOverview = {
    totalOrders: '89',
    revenueThisMonth: 'CHF 12,450',
    topSelling: 'Eco Wooden Blocks',
    fulfillmentRate: '98%',
  };

  const productManagement = {
    active: '24',
    pending: '2',
    lowStock: ['Nap Mats', 'Organic Snacks'],
  };

  const orderManagement = {
    pending: '5',
    toFulfill: ['#ORD551', '#ORD553'],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-swiss-charcoal">
          {t('supplierDashboard.title')}
        </h1>
        <p className="text-gray-500 mt-1">{t('supplierDashboard.welcomeMessage', { name: currentUser?.name?.split(' ')[0] })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sales Overview Widget */}
        <Card className="p-6 md:col-span-2 lg:col-span-1">
          <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">{t('supplierDashboard.widgets.sales.title')}</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-gray-600">{t('supplierDashboard.widgets.sales.totalOrders')}</span>
              <span className="font-bold text-lg text-swiss-charcoal">{salesOverview.totalOrders} <span className="text-xs text-green-600">(+5%)</span></span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-gray-600">{t('supplierDashboard.widgets.sales.revenueMonth')}</span>
              <span className="font-bold text-lg text-swiss-charcoal">{salesOverview.revenueThisMonth}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-gray-600">{t('supplierDashboard.widgets.sales.topSelling')}</span>
              <span className="font-medium text-sm text-swiss-teal">{salesOverview.topSelling}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-gray-600">{t('supplierDashboard.widgets.sales.fulfillmentRate')}</span>
              <span className="font-bold text-lg text-swiss-mint">{salesOverview.fulfillmentRate}</span>
            </div>
          </div>
           <Button variant="secondary" size="sm" className="w-full mt-5" onClick={() => navigate('/supplier/analytics')}>{t('supplierDashboard.widgets.sales.button')}</Button>
        </Card>

        {/* Product Management Widget */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">{t('supplierDashboard.widgets.products.title')}</h2>
          <div className="space-y-3">
             <div className="flex justify-between items-baseline">
              <span className="text-gray-600">{t('supplierDashboard.widgets.products.active')}</span>
              <span className="font-bold text-lg text-swiss-charcoal">{productManagement.active}</span>
            </div>
             <div className="flex justify-between items-baseline">
              <span className="text-gray-600">{t('supplierDashboard.widgets.products.pending')}</span>
              <span className="font-bold text-lg text-yellow-600">{productManagement.pending}</span>
            </div>
             <div className="mt-2">
                <p className="text-sm font-medium text-gray-600 flex items-center"><ExclamationTriangleIcon className="w-4 h-4 mr-1 text-red-500"/>{t('supplierDashboard.widgets.products.lowStock')}</p>
                <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                    {productManagement.lowStock.map(item => <li key={item}>{item}</li>)}
                </ul>
             </div>
          </div>
          <Button variant="primary" leftIcon={PlusCircleIcon} size="sm" className="w-full mt-5" onClick={() => navigate('/supplier/product-listings')}>
            {t('supplierDashboard.widgets.products.button')}
          </Button>
        </Card>

        {/* Order Management Widget */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">{t('supplierDashboard.widgets.orders.title')}</h2>
          <div className="space-y-3">
             <div className="flex justify-between items-baseline">
              <span className="text-gray-600">{t('supplierDashboard.widgets.orders.pending')}</span>
              <span className="font-bold text-lg text-swiss-coral">{orderManagement.pending}</span>
            </div>
             <div>
                <p className="text-sm font-medium text-gray-600">{t('supplierDashboard.widgets.orders.toFulfill')}</p>
                <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                    {orderManagement.toFulfill.map(item => <li key={item}>{item}</li>)}
                </ul>
             </div>
          </div>
           <Button variant="outline" size="sm" className="w-full mt-5" onClick={() => navigate('/supplier/orders')}>
                {t('supplierDashboard.widgets.orders.button')}
           </Button>
        </Card>
      </div>
    </div>
  );
};

export default SupplierDashboardPage;
