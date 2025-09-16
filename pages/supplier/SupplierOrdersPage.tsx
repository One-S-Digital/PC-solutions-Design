
import React from 'react';
import Card from '../../components/ui/Card';
import { useTranslation } from 'react-i18next';

const SupplierOrdersPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-swiss-charcoal">{t('supplierOrdersPage.title')}</h1>
      <Card className="p-6">
        <p className="text-gray-600">{t('supplierOrdersPage.description')}</p>
        <p className="text-gray-600">{t('supplierOrdersPage.filters')}</p>
        <p className="text-gray-600">{t('supplierOrdersPage.bulkActions')}</p>
        <p className="text-gray-600">{t('supplierOrdersPage.detailDrawer')}</p>
        <p className="text-gray-600">{t('supplierOrdersPage.statusFlow')}</p>
      </Card>
    </div>
  );
};

export default SupplierOrdersPage;
