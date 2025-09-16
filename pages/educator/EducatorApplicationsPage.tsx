import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ClipboardDocumentListIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Application {
  id: string;
  jobTitle: string;
  crecheName: string;
  status: 'New' | 'Interview' | 'Offer' | 'Declined' | 'Viewed'; // Added 'Viewed' as an intermediate
  lastUpdate: string;
}

const EducatorApplicationsPage: React.FC = () => {
  const mockApplications: Application[] = [
    { id: 'app1', jobTitle: 'Lead Educator (Full-time)', crecheName: 'KinderNest Geneva', status: 'Interview', lastUpdate: '2024-07-25' },
    { id: 'app2', jobTitle: 'Pedagogical Assistant', crecheName: 'Little Stars Zurich', status: 'New', lastUpdate: '2024-07-28' },
    { id: 'app3', jobTitle: 'Early Childhood Teacher', crecheName: 'Sunshine Daycare Bern', status: 'Offer', lastUpdate: '2024-07-20' },
    { id: 'app4', jobTitle: 'Part-time Educator', crecheName: 'Playful Learners Vaud', status: 'Declined', lastUpdate: '2024-07-15' },
    { id: 'app5', jobTitle: 'Intern Educator', crecheName: 'Future Minds Academy', status: 'Viewed', lastUpdate: '2024-07-29' },
  ];

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'New': return 'bg-sand-100 text-sand-700'; // Sand for New (assuming swiss-sand)
      case 'Viewed': return 'bg-blue-100 text-blue-700';
      case 'Interview': return 'bg-mint-100 text-mint-700 border border-mint-500'; // Mint outline (using bg and border for badge)
      case 'Offer': return 'bg-mint-500 text-white'; // Mint solid
      case 'Declined': return 'bg-coral-100 text-coral-700'; // Coral for Declined
      default: return 'bg-gray-100 text-gray-700';
    }
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-swiss-charcoal flex items-center">
        <ClipboardDocumentListIcon className="w-8 h-8 mr-3 text-swiss-mint" />
        My Applications
      </h1>
      <Card className="p-0 overflow-hidden"> {/* p-0 for table to take full width of card */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crèche / Foundation</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-swiss-charcoal">{app.jobTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{app.crecheName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                      {/* Adjust color mapping based on actual tailwind config for sand, mint */}
                      {/* Assuming 'mint-100', 'coral-100' exist based on primary colors */}
                      {app.status === 'New' && 'New (Sand)'}
                      {app.status === 'Viewed' && 'Viewed by Foundation'}
                      {app.status === 'Interview' && 'Interview (Mint Outline)'}
                      {app.status === 'Offer' && 'Offer (Mint Solid)'}
                      {app.status === 'Declined' && 'Declined (Coral)'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{app.lastUpdate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button variant="ghost" size="sm" leftIcon={EyeIcon} onClick={() => alert(`Viewing details for ${app.jobTitle}`)}>
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {mockApplications.length === 0 && <p className="text-center text-gray-500 py-8">You have not submitted any applications yet.</p>}
      </Card>
      <p className="text-xs text-gray-500 text-center">Status auto-updates when a foundation changes your application stage.</p>
    </div>
  );
};

export default EducatorApplicationsPage;