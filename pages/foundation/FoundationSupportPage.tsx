
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { STANDARD_INPUT_FIELD } from '../../constants';
import { QuestionMarkCircleIcon, LifebuoyIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="text-md font-medium text-swiss-charcoal">{question}</h3>
        {isOpen ? <ChevronUpIcon className="w-5 h-5 text-swiss-teal" /> : <ChevronDownIcon className="w-5 h-5 text-gray-400" />}
      </button>
      {isOpen && <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{answer}</p>}
    </div>
  );
};

const FoundationSupportPage: React.FC = () => {
  const faqs = [
    { question: "How do I manage parent leads?", answer: "Navigate to 'Parent Leads' from your dashboard. You can view new leads, mark your interest, send messages, and update lead statuses (e.g., Contacted, Tour Scheduled, Enrolled)." },
    { question: "How do I use the Marketplace to order products or services?", answer: "Go to the 'Marketplace' tab. You can browse product suppliers or service providers. Click on a supplier/provider to view their profile and offerings, then add products to your order or request a service." },
    { question: "Where can I manage my daycare's public profile?", answer: "Your 'Organisation Profile' page allows you to update your logo, cover image, pedagogy statement, capacity, contact information, and links for bookings or social media." },
    { question: "How does recruitment work on the platform?", answer: "The 'Recruitment' section lets you post job listings, view a candidate pool (if subscribed), and track applicants through stages like New, Interview, Offer, Hired/Rejected." },
  ];

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Support ticket submitted by Foundation:", { subject: ticketSubject, message: ticketMessage });
    alert("Support ticket submitted. We will get back to you shortly.");
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-swiss-charcoal flex items-center">
        <LifebuoyIcon className="w-8 h-8 mr-3 text-swiss-mint" />
        Support Center (Foundation)
      </h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-swiss-charcoal mb-4 flex items-center">
          <QuestionMarkCircleIcon className="w-6 h-6 mr-2 text-swiss-teal" />
          Frequently Asked Questions
        </h2>
        {faqs.map(faq => <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />)}
        <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-swiss-charcoal mb-2">Need Further Assistance?</h2>
            <p className="text-gray-600 text-sm">If you can't find an answer here, please contact our support team at <a href="mailto:support@procrechesolutions.com" className="text-swiss-mint hover:underline">support@procrechesolutions.com</a>.</p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">Submit a Support Ticket</h2>
        <form onSubmit={handleTicketSubmit} className="space-y-4">
          <div>
            <label htmlFor="ticketSubjectFoundation" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              id="ticketSubjectFoundation"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              required
              className={STANDARD_INPUT_FIELD}
              placeholder="e.g., Issue with a parent lead, Marketplace order query"
            />
          </div>
          <div>
            <label htmlFor="ticketMessageFoundation" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              id="ticketMessageFoundation"
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              required
              rows={5}
              className={STANDARD_INPUT_FIELD}
              placeholder="Please describe your issue or question in detail."
            />
          </div>
          <div>
            <Button type="submit" variant="primary">Submit Ticket</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default FoundationSupportPage;
