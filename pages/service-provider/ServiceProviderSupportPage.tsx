
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { STANDARD_INPUT_FIELD } from '../../constants';
import { QuestionMarkCircleIcon, LifebuoyIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface FAQItemProps {
  questionKey: string;
  answerKey: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ questionKey, answerKey }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="text-md font-medium text-swiss-charcoal">{t(questionKey)}</h3>
        {isOpen ? <ChevronUpIcon className="w-5 h-5 text-swiss-teal" /> : <ChevronDownIcon className="w-5 h-5 text-gray-400" />}
      </button>
      {isOpen && <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{t(answerKey)}</p>}
    </div>
  );
};

const ServiceProviderSupportPage: React.FC = () => {
  const { t } = useTranslation();
  const faqs = [
    { questionKey: "serviceProviderSupportPage.faq.listService.q", answerKey: "serviceProviderSupportPage.faq.listService.a" },
    { questionKey: "serviceProviderSupportPage.faq.respondRequests.q", answerKey: "serviceProviderSupportPage.faq.respondRequests.a" },
    { questionKey: "serviceProviderSupportPage.faq.updateAvailability.q", answerKey: "serviceProviderSupportPage.faq.updateAvailability.a" },
    { questionKey: "serviceProviderSupportPage.faq.profileInfo.q", answerKey: "serviceProviderSupportPage.faq.profileInfo.a" },
  ];

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Support ticket submitted:", { subject: ticketSubject, message: ticketMessage });
    alert(t('serviceProviderSupportPage.ticketSubmittedAlert'));
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-swiss-charcoal flex items-center">
        <LifebuoyIcon className="w-8 h-8 mr-3 text-swiss-mint" />
        {t('serviceProviderSupportPage.title')}
      </h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-swiss-charcoal mb-4 flex items-center">
          <QuestionMarkCircleIcon className="w-6 h-6 mr-2 text-swiss-teal" />
          {t('supplierSupportPage.faqTitle')}
        </h2>
        {faqs.map(faq => <FAQItem key={faq.questionKey} questionKey={faq.questionKey} answerKey={faq.answerKey} />)}
         <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-swiss-charcoal mb-2">{t('supplierSupportPage.furtherAssistanceTitle')}</h2>
            <p className="text-gray-600 text-sm">{t('supplierSupportPage.furtherAssistanceText.0')} <a href="mailto:support@procrechesolutions.com" className="text-swiss-mint hover:underline">{t('supplierSupportPage.furtherAssistanceText.1')}</a>.</p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">{t('supplierSupportPage.submitTicketTitle')}</h2>
        <form onSubmit={handleTicketSubmit} className="space-y-4">
          <div>
            <label htmlFor="ticketSubjectSp" className="block text-sm font-medium text-gray-700 mb-1">{t('supplierSupportPage.ticketForm.subjectLabel')}</label>
            <input
              type="text"
              id="ticketSubjectSp"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              required
              className={STANDARD_INPUT_FIELD}
              placeholder={t('serviceProviderSupportPage.ticketForm.subjectPlaceholder')}
            />
          </div>
          <div>
            <label htmlFor="ticketMessageSp" className="block text-sm font-medium text-gray-700 mb-1">{t('supplierSupportPage.ticketForm.messageLabel')}</label>
            <textarea
              id="ticketMessageSp"
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              required
              rows={5}
              className={STANDARD_INPUT_FIELD}
              placeholder={t('serviceProviderSupportPage.ticketForm.messagePlaceholder')}
            />
          </div>
          <div>
            <Button type="submit" variant="primary">{t('buttons.submitTicket')}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ServiceProviderSupportPage;
