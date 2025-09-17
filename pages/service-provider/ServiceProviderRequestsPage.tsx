import React from 'react';
import Card from '../../components/ui/Card';
import { useTranslation } from 'react-i18next';

const ServiceProviderRequestsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-swiss-charcoal">{t('serviceProviderRequestsPage.title')}</h1>
      <Card className="p-6">
        <p className="text-gray-600">{t('serviceProviderRequestsPage.description')}</p>
        <p className="text-gray-600">{t('serviceProviderRequestsPage.filters')}</p>
        <p className="text-gray-600">{t('serviceProviderRequestsPage.bulkActions')}</p>
        <p className="text-gray-600">{t('serviceProviderRequestsPage.detailDrawer')}</p>
        <p className="text-gray-600">{t('serviceProviderRequestsPage.statusFlow')}</p>
      </Card>
    </div>
  );
};

export default ServiceProviderRequestsPage;