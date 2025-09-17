
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ParentLead, LeadMainStatus, FoundationLeadResponseStatus } from '../types';
import Card from '../components/ui/Card';
import { ClipboardDocumentListIcon, ClockIcon, CheckCircleIcon, InformationCircleIcon, InboxIcon } from '@heroicons/react/24/outline';

const ParentEnquiriesPage: React.FC = () => {
  const { currentUser, leads } = useAppContext();

  if (!currentUser || currentUser.role !== 'Parent') {
    return (
      <div className="text-center p-10">
        <h1 className="text-2xl font-bold text-swiss-charcoal">Access Denied</h1>
        <p className="text-gray-600">You must be logged in as a Parent to view this page.</p>
      </div>
    );
  }

  const myLeads = leads.filter(lead => lead.parentId === currentUser.id);

  const getStatusColor = (status: LeadMainStatus) => {
    switch (status) {
      case LeadMainStatus.NEW: return 'bg-blue-100 text-blue-700';
      case LeadMainStatus.PROCESSING: return 'bg-yellow-100 text-yellow-700';
      case LeadMainStatus.PARENT_ACTION_REQUIRED: return 'bg-orange-100 text-orange-700';
      case LeadMainStatus.CLOSED_ENROLLED: return 'bg-green-100 text-green-700';
      case LeadMainStatus.CLOSED_OTHER: return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getFoundationResponseStatusInfo = (status: FoundationLeadResponseStatus) => {
    switch(status) {
        case FoundationLeadResponseStatus.INTERESTED: return { text: "Interested", color: "text-green-600"};
        case FoundationLeadResponseStatus.NOT_INTERESTED: return { text: "Not Interested", color: "text-red-600"};
        case FoundationLeadResponseStatus.NEEDS_MORE_INFO: return { text: "Needs More Info From You", color: "text-orange-600"};
        case FoundationLeadResponseStatus.ENROLLED: return { text: "Enrolled", color: "text-purple-600"};
        default: return { text: "Awaiting Response", color: "text-gray-500"};
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-swiss-charcoal flex items-center">
          <ClipboardDocumentListIcon className="w-8 h-8 mr-3 text-swiss-mint" />
          My Daycare Enquiries
        </h1>
      </div>

      {myLeads.length === 0 && (
        <Card className="p-10 text-center">
          <InboxIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-swiss-charcoal mb-2">No Enquiries Yet</h2>
          <p className="text-gray-500">You haven't submitted any daycare enquiries. <a href="/#/parent-lead-form" className="text-swiss-mint hover:underline">Submit one now!</a></p>
        </Card>
      )}

      {myLeads.map((lead) => (
        <Card key={lead.id} className="p-5 hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row justify-between md:items-start">
            <div>
              <h2 className="text-xl font-semibold text-swiss-teal mb-1">
                Enquiry for {lead.canton} {lead.municipality ? `- ${lead.municipality}` : ''}
              </h2>
              <p className="text-sm text-gray-500">Submitted: {new Date(lead.submissionDate).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Child's Age: {lead.childAge} | Desired Start: {new Date(lead.desiredStartDate).toLocaleDateString()}</p>
            </div>
            <div className={`mt-2 md:mt-0 px-3 py-1 text-sm font-medium rounded-full inline-block ${getStatusColor(lead.mainStatus)}`}>
              {lead.mainStatus}
            </div>
          </div>

          {lead.specialNeeds && (
            <p className="text-sm text-gray-600 mt-2"><InformationCircleIcon className="w-4 h-4 inline mr-1 text-gray-400" />Notes: {lead.specialNeeds}</p>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-md font-semibold text-swiss-charcoal mb-2">Foundation Responses:</h3>
            {lead.responses.length === 0 && lead.mainStatus === LeadMainStatus.NEW && (
                <p className="text-sm text-gray-500">We are currently matching your enquiry with daycares. You'll be notified of responses.</p>
            )}
            {lead.responses.map(response => {
                const statusInfo = getFoundationResponseStatusInfo(response.status);
                return (
                    <div key={response.foundationId} className="p-3 mb-2 bg-gray-50 rounded-md">
                        <div className="flex justify-between items-center">
                            <p className="font-medium text-swiss-charcoal">{response.foundationName}</p>
                            <p className={`text-sm font-semibold ${statusInfo.color}`}>{statusInfo.text}</p>
                        </div>
                        {response.messageToParent && <p className="text-xs text-gray-600 mt-1 italic">Message: {response.messageToParent}</p>}
                    </div>
                );
            })}
             {lead.assignedFoundations.length > 0 && lead.responses.length < lead.assignedFoundations.length && lead.mainStatus !== LeadMainStatus.CLOSED_ENROLLED && lead.mainStatus !== LeadMainStatus.CLOSED_OTHER && (
                <p className="text-sm text-gray-500 mt-2">Waiting for responses from other matched daycares...</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ParentEnquiriesPage;
