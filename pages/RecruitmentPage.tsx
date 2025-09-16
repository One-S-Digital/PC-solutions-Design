import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { JobListing, CandidateProfile, UserRole } from '../types';
import { MOCK_JOB_LISTINGS, MOCK_CANDIDATE_PROFILES, STANDARD_INPUT_FIELD, ICON_INPUT_FIELD } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import { BriefcaseIcon, UserGroupIcon, MapPinIcon, CalendarDaysIcon, EyeIcon, PencilIcon, TrashIcon, PlusCircleIcon, MagnifyingGlassIcon, FunnelIcon, StarIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import { useTranslation } from 'react-i18next';


const JobListingCard: React.FC<{ job: JobListing }> = ({ job }) => {
  const { t } = useTranslation();
  return (
  <Card className="mb-4" hoverEffect>
    <div className="p-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-swiss-teal">{job.title}</h3>
          <p className="text-sm text-gray-500 mb-1">{job.foundationName}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${job.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {job.status}
        </span>
      </div>
      <div className="mt-3 space-y-1 text-sm text-gray-600">
        <p><MapPinIcon className="w-4 h-4 inline mr-2 text-gray-400" />{job.location}</p>
        <p><BriefcaseIcon className="w-4 h-4 inline mr-2 text-gray-400" />{job.contractType}</p>
        <p><CalendarDaysIcon className="w-4 h-4 inline mr-2 text-gray-400" />Start Date: {job.startDate}</p>
        <p><UserGroupIcon className="w-4 h-4 inline mr-2 text-gray-400" />Applications: {job.applicationsReceived}</p>
      </div>
    </div>
    <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-2">
      <Button variant="ghost" size="sm" leftIcon={EyeIcon} onClick={() => alert('View Job TBD')}>{t('buttons.view')}</Button>
      <Button variant="ghost" size="sm" leftIcon={PencilIcon} className="text-blue-600 hover:text-blue-700" onClick={() => alert('Edit Job TBD')}>{t('buttons.edit')}</Button>
      <Button variant="ghost" size="sm" leftIcon={TrashIcon} className="text-red-600 hover:text-red-700" onClick={() => alert('Close Job TBD')}>{t('buttons.close')}</Button>
    </div>
  </Card>
  );
};

interface CandidateCardProps {
  candidate: CandidateProfile;
  onRemove: (candidateId: string) => void;
  onEdit: (candidate: CandidateProfile) => void;
  canEditRemove: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onRemove, onEdit, canEditRemove }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Card className="mb-4 flex flex-col" hoverEffect>
      <div className="p-5 flex-grow">
        <div className="flex items-center mb-3">
          <img src={candidate.avatarUrl || 'https://picsum.photos/100/100'} alt={candidate.name} className="w-16 h-16 rounded-full mr-4" />
          <div>
            <h3 className="text-xl font-semibold text-swiss-mint">{candidate.name}</h3>
            <p className="text-sm text-gray-500">{candidate.role}</p>
          </div>
          <StarIcon className="w-5 h-5 text-gray-300 hover:text-yellow-400 ml-auto cursor-pointer" onClick={() => alert('Favorite TBD')}/>
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <p><CalendarDaysIcon className="w-4 h-4 inline mr-2 text-gray-400" />{candidate.availabilityStatus || candidate.availability}</p>
          <p><MapPinIcon className="w-4 h-4 inline mr-2 text-gray-400" />Region: {candidate.location || candidate.preferredRegion}</p>
          {candidate.shortBio && <p className="mt-2 text-xs italic line-clamp-2">{candidate.shortBio}</p>}
          {!candidate.shortBio && candidate.experience && <p className="mt-2 text-xs italic line-clamp-2">{candidate.experience}</p>}
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 flex justify-end items-center gap-2">
        <Button variant="outline" size="xs" leftIcon={EyeIcon} onClick={() => navigate(`/candidate/${candidate.id}`)}>{t('recruitmentPage.candidateCard.viewProfile')}</Button>
        {canEditRemove && (
          <>
            <Button variant="ghost" size="xs" leftIcon={PencilIcon} className="text-blue-600 hover:text-blue-700" onClick={() => onEdit(candidate)}>{t('buttons.edit')}</Button>
            <Button variant="ghost" size="xs" leftIcon={TrashIcon} className="text-red-600 hover:text-red-700" onClick={() => {
                if (window.confirm(t('recruitmentPage.confirmRemoveCandidate', {name: candidate.name}))) {
                    onRemove(candidate.id);
                }
            }}>{t('buttons.remove')}</Button>
          </>
        )}
      </div>
    </Card>
  );
};


const RecruitmentPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [searchTermJobs, setSearchTermJobs] = useState('');
  const [searchTermCandidates, setSearchTermCandidates] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [candidateProfiles, setCandidateProfiles] = useState<CandidateProfile[]>(MOCK_CANDIDATE_PROFILES);

  const canPostJob = currentUser?.role === UserRole.FOUNDATION || currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPER_ADMIN;
  const isAdminOrSuperAdmin = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPER_ADMIN;

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/candidate-pool')) {
      setActiveTabIndex(1);
    } else {
      setActiveTabIndex(0);
    }
  }, [location.pathname]);

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
    if (index === 0) {
      navigate('/recruitment/job-listings');
    } else if (index === 1) {
      navigate('/recruitment/candidate-pool');
    }
  };

  const filteredJobs = useMemo(() =>
    MOCK_JOB_LISTINGS.filter(job =>
      job.title.toLowerCase().includes(searchTermJobs.toLowerCase()) ||
      job.foundationName.toLowerCase().includes(searchTermJobs.toLowerCase())
    ), [searchTermJobs]);

  const filteredCandidates = useMemo(() =>
    candidateProfiles.filter(candidate =>
      candidate.name.toLowerCase().includes(searchTermCandidates.toLowerCase()) ||
      (candidate.role && candidate.role.toLowerCase().includes(searchTermCandidates.toLowerCase()))
    ), [searchTermCandidates, candidateProfiles]);
    
  const handleRemoveCandidate = (candidateId: string) => {
    setCandidateProfiles(prev => prev.filter(c => c.id !== candidateId));
  };
  
  const handleEditCandidate = (candidate: CandidateProfile) => {
    alert(`Editing candidate ${candidate.name} (ID: ${candidate.id}) - Functionality TBD. This would open a form/modal pre-filled with candidate data.`);
    // For a full implementation, you might open a modal here:
    // setEditingCandidate(candidate);
    // setIsCandidateModalOpen(true);
  };

  const handleAddNewCandidate = () => {
    alert('Adding a new candidate - Functionality TBD. This would open a form/modal for new candidate entry.');
    // For a full implementation:
    // setEditingCandidate(null); // Ensure no existing data is pre-filled
    // setIsCandidateModalOpen(true);
  };


  const JobOffersTab: React.ReactNode = (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-4 bg-white rounded-lg shadow">
        <div className="relative flex-grow mb-2 sm:mb-0 sm:mr-4">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <label htmlFor="searchJobs" className="sr-only">{t('recruitmentPage.jobOffers.searchPlaceholder')}</label>
            <input
              id="searchJobs"
              type="text"
              placeholder={t('recruitmentPage.jobOffers.searchPlaceholder')}
              value={searchTermJobs}
              onChange={(e) => setSearchTermJobs(e.target.value)}
              className={ICON_INPUT_FIELD}
            />
        </div>
        <div className="flex space-x-2">
            <Button variant="outline" leftIcon={FunnelIcon} onClick={() => {setShowFilters(!showFilters); alert('Filter UI TBD');}}>{t('recruitmentPage.buttons.filters')}</Button>
            {canPostJob && (
                <Button variant="primary" leftIcon={PlusCircleIcon} className="bg-swiss-mint hover:bg-opacity-90 fixed bottom-6 right-6 lg:static z-10 shadow-lg lg:shadow-none" onClick={() => alert('Post New Job TBD')}>{t('recruitmentPage.buttons.postNewJob')}</Button>
            )}
        </div>
      </div>
       {showFilters && (
        <Card className="p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">{t('recruitmentPage.jobOffers.filterTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder={t('recruitmentPage.labels.location')} className={STANDARD_INPUT_FIELD} aria-label={t('recruitmentPage.labels.location')}/>
            <select className={STANDARD_INPUT_FIELD} aria-label={t('recruitmentPage.labels.allContractTypes')}><option>{t('recruitmentPage.labels.allContractTypes')}</option></select>
            <select className={STANDARD_INPUT_FIELD} aria-label={t('recruitmentPage.labels.allStatuses')}><option>{t('recruitmentPage.labels.allStatuses')}</option></select>
          </div>
           <Button variant="secondary" size="sm" className="mt-2" onClick={() => alert('Apply Job Filters TBD')}>{t('recruitmentPage.buttons.applyFilters')}</Button>
        </Card>
      )}
      <p className="text-sm text-gray-600">{t('recruitmentPage.jobOffers.activeJobsCount', { count: filteredJobs.filter(j => j.status === 'Open').length })}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        {filteredJobs.map(job => <JobListingCard key={job.id} job={job} />)}
      </div>
      {filteredJobs.length === 0 && <p className="text-center text-gray-500 py-8">{t('recruitmentPage.jobOffers.emptyState')}</p>}
    </div>
  );

  const CandidateAvailabilityTab: React.ReactNode = (
    <div className="space-y-4">
       <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-4 bg-white rounded-lg shadow">
        <div className="relative flex-grow mb-2 sm:mb-0 sm:mr-4">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <label htmlFor="searchCandidates" className="sr-only">{t('recruitmentPage.candidatePool.searchPlaceholder')}</label>
            <input
              id="searchCandidates"
              type="text"
              placeholder={t('recruitmentPage.candidatePool.searchPlaceholder')}
              value={searchTermCandidates}
              onChange={(e) => setSearchTermCandidates(e.target.value)}
              className={ICON_INPUT_FIELD}
            />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" leftIcon={FunnelIcon} onClick={() => {setShowFilters(!showFilters); alert('Filter UI TBD');}}>{t('recruitmentPage.buttons.filters')}</Button>
          {isAdminOrSuperAdmin && (
             <Button variant="primary" leftIcon={PlusCircleIcon} onClick={handleAddNewCandidate} className="bg-swiss-mint hover:bg-opacity-90">Add Candidate</Button>
          )}
        </div>
      </div>
      {showFilters && (
        <Card className="p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">{t('recruitmentPage.candidatePool.filterTitle')}</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <select className={STANDARD_INPUT_FIELD} aria-label={t('recruitmentPage.labels.allRoles')}><option>{t('recruitmentPage.labels.allRoles')}</option></select>
            <input type="text" placeholder={t('recruitmentPage.labels.region')} className={STANDARD_INPUT_FIELD} aria-label={t('recruitmentPage.labels.region')}/>
            <input type="date" placeholder={t('recruitmentPage.labels.availabilityDate')} className={STANDARD_INPUT_FIELD} aria-label={t('recruitmentPage.labels.availabilityDate')}/>
            <select className={STANDARD_INPUT_FIELD} aria-label={t('recruitmentPage.labels.allContractTypes')}><option>{t('recruitmentPage.labels.allContractTypes')}</option></select>
          </div>
          <Button variant="secondary" size="sm" className="mt-2" onClick={() => alert('Apply Candidate Filters TBD')}>{t('recruitmentPage.buttons.applyFilters')}</Button>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map(candidate => <CandidateCard key={candidate.id} candidate={candidate} onRemove={handleRemoveCandidate} onEdit={handleEditCandidate} canEditRemove={isAdminOrSuperAdmin} />)}
      </div>
      {filteredCandidates.length === 0 && <p className="text-center text-gray-500 py-8">{t('recruitmentPage.candidatePool.emptyState')}</p>}
    </div>
  );

  const tabsConfig = [
    { label: t('recruitmentPage.tabs.jobOffers'), icon: BriefcaseIcon, content: JobOffersTab },
    { label: t('recruitmentPage.tabs.candidatePool'), icon: UserGroupIcon, content: CandidateAvailabilityTab },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-swiss-charcoal">{t('recruitmentPage.title')}</h1>
      <Tabs 
        tabs={tabsConfig} 
        variant="pills"
        activeTab={activeTabIndex}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default RecruitmentPage;