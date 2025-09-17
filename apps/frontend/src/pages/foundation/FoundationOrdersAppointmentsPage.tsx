
import React, { useState, useMemo } from 'react';
import Card from 'packages/ui/src/components/Card';
import Tabs from 'packages/ui/src/components/Tabs';
import Button from 'packages/ui/src/components/Button';
import { ShoppingCartIcon, CalendarDaysIcon, InboxIcon } from '@heroicons/react/24/outline';
import { useAppContext } from 'packages/contexts/src/AppContext';
import { Order, ServiceRequest, OrderRequestStatus, ServiceRequestStatus } from 'packages/core/src/types';
import { MOCK_ORDERS, MOCK_SERVICE_REQUESTS, MOCK_ORGANIZATIONS } from 'packages/core/src/constants';
import { useTranslation } from 'react-i18next';

const FoundationOrdersAppointmentsPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState(0);

  const foundationOrgId = currentUser?.orgId;

  const productOrders = useMemo(() => {
    if (!foundationOrgId) return [];
    return MOCK_ORDERS.filter(order => order.foundationOrgId === foundationOrgId);
  }, [foundationOrgId]);

  const serviceAppointments = useMemo(() => {
    if (!foundationOrgId) return [];
    return MOCK_SERVICE_REQUESTS.filter(req => req.foundationOrgId === foundationOrgId);
  }, [foundationOrgId]);

  const getOrderStatusClass = (status: OrderRequestStatus) => {
    switch (status) {
      case OrderRequestStatus.SUBMITTED: return 'bg-swiss-coral/20 text-swiss-coral';
      case OrderRequestStatus.ACCEPTED: return 'bg-swiss-mint/20 text-swiss-mint';
      case OrderRequestStatus.PROCESSING: return 'bg-swiss-sand/30 text-amber-700';
      case OrderRequestStatus.SHIPPED: return 'bg-swiss-teal/20 text-swiss-teal';
      case OrderRequestStatus.FULFILLED: return 'bg-swiss-mint text-white';
      case OrderRequestStatus.CANCELLED:
      case OrderRequestStatus.DECLINED:
        return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getServiceStatusClass = (status: ServiceRequestStatus) => {
    switch (status) {
      case ServiceRequestStatus.NEW: return 'bg-swiss-coral/20 text-swiss-coral';
      case ServiceRequestStatus.IN_REVIEW: return 'bg-swiss-sand/30 text-amber-700';
      case ServiceRequestStatus.ACCEPTED:
      case ServiceRequestStatus.SCHEDULED:
         return 'bg-swiss-mint/20 text-swiss-mint';
      case ServiceRequestStatus.COMPLETED: return 'bg-swiss-mint text-white';
      case ServiceRequestStatus.REJECTED:
      case ServiceRequestStatus.CANCELLED:
        return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const ProductOrdersView = () => (
    <Card className="p-4 mt-4 shadow-md">
       {productOrders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
            <InboxIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            {t('foundationOrdersAppointmentsPage.noProductOrders')}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('foundationOrdersAppointmentsPage.table.refNo')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('foundationOrdersAppointmentsPage.table.supplier')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('foundationOrdersAppointmentsPage.table.itemsQty')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('foundationOrdersAppointmentsPage.table.total')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('foundationOrdersAppointmentsPage.table.date')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('foundationOrdersAppointmentsPage.table.status')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-swiss-teal">{order.id.substring(0,8)}</td>
                    <td className="px-4 py-2">{order.supplierName}</td>
                    <td className="px-4 py-2">{order.items.reduce((acc, item) => acc + item.quantity, 0)}</td>
                    <td className="px-4 py-2">CHF {order.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-2">{new Date(order.requestDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusClass(order.status)}`}>
                        {t(`orderStatus.${order.status.toLowerCase()}`, order.status) as string}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );

  const ServiceAppointmentsView = () => (
    <Card className="p-4 mt-4 shadow-md">
      {serviceAppointments.length === 0 ? (
         <div className="text-center py-10 text-gray-500">
            <InboxIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            {t('foundationOrdersAppointmentsPage.noServiceAppointments')}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
               <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('foundationOrdersAppointmentsPage.table.refNo')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('foundationOrdersAppointmentsPage.table.provider')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('foundationOrdersAppointmentsPage.table.service')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('foundationOrdersAppointmentsPage.table.date')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('foundationOrdersAppointmentsPage.table.status')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {serviceAppointments.map(req => {
                const provider = MOCK_ORGANIZATIONS.find(org => org.id === req.providerId);
                return (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-swiss-teal">{req.id.substring(0,8)}</td>
                    <td className="px-4 py-2">{provider?.name || 'Unknown'}</td>
                    <td className="px-4 py-2">{req.serviceName}</td>
                    <td className="px-4 py-2">{req.appointmentDate ? new Date(req.appointmentDate).toLocaleDateString() : 'Pending'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getServiceStatusClass(req.status)}`}>
                        {t(`serviceStatus.${req.status.toLowerCase().replace(/\s+/g, '')}`, req.status) as string}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );

  const tabs = [
    { label: t('foundationOrdersAppointmentsPage.productOrdersTab'), icon: ShoppingCartIcon, content: <ProductOrdersView /> },
    { label: t('foundationOrdersAppointmentsPage.serviceAppointmentsTab'), icon: CalendarDaysIcon, content: <ServiceAppointmentsView /> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-swiss-charcoal">{t('sidebar.ordersAppointments')}</h1>
       <Tabs
         tabs={tabs}
         variant="pills"
         activeTab={activeTab}
         onTabChange={setActiveTab}
       />
    </div>
  );
};

export default FoundationOrdersAppointmentsPage;
