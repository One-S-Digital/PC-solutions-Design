
import React, { useState, useMemo } from 'react';
import { JobListing } from '../../types';
import { MOCK_JOB_LISTINGS, STANDARD_INPUT_FIELD, ICON_INPUT_FIELD } from '../../constants';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { BriefcaseIcon, MapPinIcon, CalendarDaysIcon, MagnifyingGlassIcon, FunnelIcon, EyeIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface EducatorJobCardProps {
  job: JobListing;
  onApply: (jobId: string) => void;
}

const EducatorJobCard: React.FC<EducatorJobCardProps> = ({ job, onApply }) => {
  const contractTypeColor = (type: JobListing['contractType']) => {
    switch(type) {
      case 'CDI': return 'bg-blue-100 text-blue-700';
      case 'CDD': return 'bg-yellow-100 text-yellow-700';
      case 'Internship': return 'bg-purple-100 text-purple-700';
      case 'Part-time': return 'bg-teal-100 text-teal-700';
      case 'Full-time': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="flex flex-col group" hoverEffect>
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-swiss-teal group-hover:text-swiss-mint transition-colors">{job.title}</h3>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${contractTypeColor(job.contractType)}`}>
                {job.contractType}
            </span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-1">
          {/* Mock logo, replace with actual if available */}
          <img src={`https://picsum.photos/seed/${job.foundationName.replace(/\s+/g, '')}/40/40`} alt={job.foundationName} className="w-6 h-6 rounded-full mr-2 border"/>
          {job.foundationName}
        </div>
        <div className="text-sm text-gray-600 space-y-1 mb-3">
          <p><MapPinIcon className="w-4 h-4 inline mr-1.5 text-gray-400" />{job.location}</p>
          <p><CalendarDaysIcon className="w-4 h-4 inline mr-1.5 text-gray-400" />Posted: {new Date(job.startDate).toLocaleDateString()} (Mocked as Start Date)</p>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{job.description}</p>
      </div>
      <div className="bg-gray-50 px-5 py-3 border-t flex justify-end">
        <Button variant="primary" size="sm" leftIcon={ArrowTopRightOnSquareIcon} onClick={() => onApply(job.id)} className="w-full">
          Apply Now
        </Button>
      </div>
    </Card>
  );
};


const EducatorJobBoardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCanton, setFilterCanton] = useState('All');
  const [filterContractType, setFilterContractType] = useState('All');
  const [filterLanguage, setFilterLanguage] = useState('All'); // Mock, needs job data update
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [applyingJobTitle, setApplyingJobTitle] = useState('');

  const cantons = ['All', 'Geneva', 'Vaud', 'Zurich', 'Bern', 'Luzern']; // Mock
  const contractTypes = ['All', 'CDI', 'CDD', 'Internship', 'Part-time', 'Full-time'];
  const languages = ['All', 'French', 'English', 'German']; // Mock

  const filteredJobs = useMemo(() =>
    MOCK_JOB_LISTINGS.filter(job =>
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.foundationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCanton === 'All' || job.location.includes(filterCanton)) && // Simple location check
      (filterContractType === 'All' || job.contractType === filterContractType) &&
      (job.status === 'Open') // Only show open jobs
      // Add language filter if job data supports it
    ), [searchTerm, filterCanton, filterContractType, filterLanguage]);

  const handleApply = (jobId: string) => {
    const job = MOCK_JOB_LISTINGS.find(j => j.id === jobId);
    if (job) {
        setApplyingJobTitle(job.title);
        setShowConfirmModal(true);
    }
  };
  
  const confirmApplication = () => {
    console.log(`Applied for ${applyingJobTitle}`);
    // Add to applications list, notify foundation etc.
    setShowConfirmModal(false);
    alert(`Successfully applied for ${applyingJobTitle}!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-swiss-charcoal mb-4 md:mb-0">Job Board</h1>
        <div className="relative w-full md:w-1/3">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by keyword (title, crèche, skill)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${ICON_INPUT_FIELD} w-full`}
            />
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="filterCanton" className="block text-xs font-medium text-gray-500 mb-1">Canton</label>
            <select id="filterCanton" value={filterCanton} onChange={(e) => setFilterCanton(e.target.value)} className={STANDARD_INPUT_FIELD}>
              {cantons.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filterContractType" className="block text-xs font-medium text-gray-500 mb-1">Contract Type</label>
            <select id="filterContractType" value={filterContractType} onChange={(e) => setFilterContractType(e.target.value)} className={STANDARD_INPUT_FIELD}>
              {contractTypes.map(ct => <option key={ct} value={ct}>{ct}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filterLanguage" className="block text-xs font-medium text-gray-500 mb-1">Language</label>
            <select id="filterLanguage" value={filterLanguage} onChange={(e) => setFilterLanguage(e.target.value)} className={STANDARD_INPUT_FIELD}>
              {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
        </div>
      </Card>
      
      {filteredJobs.length === 0 && <p className="text-center text-gray-500 py-8">No job openings match your criteria at the moment.</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map(job => <EducatorJobCard key={job.id} job={job} onApply={handleApply}/>)}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-2">Confirm Application</h2>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to apply for the position: <strong>{applyingJobTitle}</strong>?</p>
            <div className="flex justify-end space-x-2">
              <Button variant="light" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={confirmApplication}>Confirm Apply</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EducatorJobBoardPage;
