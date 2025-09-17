import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const SupplierProductListingsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-swiss-charcoal">{t('supplierProductListingsPage.title')}</h1>
        <Button variant="primary" leftIcon={PlusCircleIcon} onClick={() => alert(t('supplierProductListingsPage.addProductAlert'))}>
          {t('supplierProductListingsPage.addProductButton')}
        </Button>
      </div>
      <Card className="p-6">
        <p className="text-gray-600">{t('supplierProductListingsPage.description')}</p>
        <p className="text-gray-600">{t('supplierProductListingsPage.columns')}</p>
        <p className="text-gray-600">{t('supplierProductListingsPage.quickActions')}</p>
        <p className="text-gray-600">{t('supplierProductListingsPage.addProductModal')}</p>
      </Card>
    </div>
  );
};

export default SupplierProductListingsPage;