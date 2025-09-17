import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOCK_PRICING_PLANS } from '../constants';
import { PricingPlan, UserRole } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

const PricingPage: React.FC = () => {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  const plansByRole = MOCK_PRICING_PLANS.reduce((acc, plan) => {
    const roleKey = plan.role as keyof typeof acc;
    (acc[roleKey] = acc[roleKey] || []).push(plan);
    return acc;
  }, {} as Record<UserRole, PricingPlan[]>);


  const PlanCard: React.FC<{ plan: PricingPlan }> = ({ plan }) => (
    <Card className={`flex flex-col p-6 border-2 ${plan.isPopular ? 'border-swiss-mint' : 'border-transparent'} relative`} hoverEffect>
      {plan.isPopular && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
            <span className="px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase bg-swiss-mint rounded-full">{t('pricingPage.popular')}</span>
        </div>
      )}
      <h3 className="text-xl font-semibold text-swiss-charcoal text-center mt-3">{plan.name}</h3>
      <div className="my-4 text-center">
        <span className="text-4xl font-bold">
          CHF {billingCycle === 'monthly' ? plan.price.monthly : Math.round(plan.price.annually / 12)}
        </span>
        <span className="text-gray-500">/ {t('pricingPage.billingToggle.monthly')}</span>
      </div>
      <p className="text-center text-xs text-gray-500 h-6">
        {billingCycle === 'annually' && t('pricingPage.billedAnnually', { amount: plan.price.annually })}
      </p>
      <ul className="space-y-3 my-6 text-sm text-gray-600 flex-grow">
        {plan.features.map(feature => (
          <li key={feature} className="flex items-start">
            <CheckCircleIcon className="w-5 h-5 text-swiss-mint mr-2 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button variant={plan.isPopular ? 'primary' : 'outline'} size="lg" className="w-full mt-auto">
        {t('pricingPage.choosePlan')}
      </Button>
    </Card>
  );
  
  const getRoleTitleKey = (role: string) => {
    switch(role) {
      case UserRole.FOUNDATION:
        return 'pricingPage.plans.foundation';
      case UserRole.PRODUCT_SUPPLIER:
        return 'pricingPage.plans.supplier';
      default:
        return `For ${role}`; // Fallback
    }
  }


  return (
    <div className="bg-page-bg min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-swiss-charcoal">{t('pricingPage.title')}</h1>
          <p className="mt-3 text-lg text-gray-600">{t('pricingPage.subtitle')}</p>
        </div>
        <div className="mt-8 flex justify-center items-center">
          <span className="text-sm font-medium">{t('pricingPage.billingToggle.monthly')}</span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-swiss-mint mx-4 ${billingCycle === 'annually' ? 'bg-swiss-mint' : 'bg-gray-300'}`}
            role="switch"
            aria-checked={billingCycle === 'annually'}
          >
            <span
              aria-hidden="true"
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${billingCycle === 'annually' ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
          <span className="text-sm font-medium">{t('pricingPage.billingToggle.annually')}</span>
          <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-swiss-mint/10 text-swiss-mint">
            {t('pricingPage.billingToggle.save')}
          </span>
        </div>
        
        {Object.entries(plansByRole).map(([role, plans]) => (
          <div key={role} className="mt-12">
            <h2 className="text-2xl font-semibold text-center text-swiss-charcoal">{t(getRoleTitleKey(role))}</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(plans as PricingPlan[]).map(plan => <PlanCard key={plan.name} plan={plan} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
