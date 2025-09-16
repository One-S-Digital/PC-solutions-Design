
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

const EducatorSupportPage: React.FC = () => {
  const faqs = [
    { question: "How do I create or update my profile?", answer: "Navigate to 'My Profile' from the sidebar. Fill in all relevant fields including your personal details, availability, desired role, and upload your CV and certificates. Click 'Save Profile' to make it visible to foundations." },
    { question: "How can I find job openings?", answer: "The 'Job Board' lists all available positions. You can use filters for canton, contract type, and keywords to narrow down your search. Click 'Apply Now' on a job listing to submit your application." },
    { question: "How can I track my applications?", answer: "The 'My Applications' page shows the status of all jobs you've applied for. Statuses (New, Interview, Offer, Declined) are updated automatically by foundations." },
    { question: "What kind of notifications will I receive?", answer: "You'll receive email and in-app notifications when a foundation views your profile, requests an interview, or when there's an update to your application status. You can also opt-in for a weekly digest of relevant job openings." },
  ];

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Support ticket submitted by Educator:", { subject: ticketSubject, message: ticketMessage });
    alert("Support ticket submitted. We will get back to you shortly.");
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-swiss-charcoal flex items-center">
        <LifebuoyIcon className="w-8 h-8 mr-3 text-swiss-mint" />
        Support Center (Educator)
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
            <label htmlFor="ticketSubjectEducator" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              id="ticketSubjectEducator"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              required
              className={STANDARD_INPUT_FIELD}
              placeholder="e.g., Problem with profile update, Question about application"
            />
          </div>
          <div>
            <label htmlFor="ticketMessageEducator" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              id="ticketMessageEducator"
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

export default EducatorSupportPage;
