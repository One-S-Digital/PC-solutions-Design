
import React from 'react';
import Card from '../../components/ui/Card';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const ParentSupportPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-swiss-charcoal flex items-center">
          <QuestionMarkCircleIcon className="w-8 h-8 mr-3 text-swiss-mint" />
          Support & FAQ
        </h1>
      </div>
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-gray-800">How does the matching process work?</h3>
            <p className="text-gray-600 text-sm">Once you submit your "Find a Crèche" form, our system identifies daycares in your preferred canton that match your criteria (child's age, desired start date). These daycares will then be notified of your enquiry.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">How long does it take to get a response?</h3>
            <p className="text-gray-600 text-sm">Most crèches reply within 24-48 hours. You can track the status of your requests on the "My Requests" page.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Is my data secure?</h3>
            <p className="text-gray-600 text-sm">Yes, we take data privacy seriously. Your information is only shared with the matched daycares for the purpose of your enquiry. Please review our Privacy Policy for more details.</p>
          </div>
          {/* Add more FAQs */}
        </div>
        <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-swiss-charcoal mb-2">Need Further Assistance?</h2>
            <p className="text-gray-600 text-sm">If you can't find an answer here, please contact our support team at <a href="mailto:support@procrechesolutions.com" className="text-swiss-mint hover:underline">support@procrechesolutions.com</a>.</p>
        </div>
      </Card>
    </div>
  );
};

export default ParentSupportPage;
