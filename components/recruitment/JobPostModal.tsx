import React, { useState, useEffect, FormEvent } from 'react';
import { JobListing } from '../../types';
import { STANDARD_INPUT_FIELD } from '../../constants';
import Button from '../ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../contexts/AppContext';

interface JobPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<JobListing, 'id' | 'applicationsReceived' | 'status'>) => void;
  existingJob?: JobListing | null;
}

const JobPostModal: React.FC<JobPostModalProps> = ({ isOpen, onClose, onSubmit, existingJob }) => {
  const { t } = useTranslation();
  const { currentUser } = useAppContext();

  const initialFormState: Omit<JobListing, 'id' | 'applicationsReceived' | 'status' | 'foundationName'> = {
    title: '',
    location: '',
    contractType: 'Full-time',
    startDate: new Date().toISOString().split('T')[0],
    description: '',
    requirements: [''],
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isOpen) {
      if (existingJob) {
        setFormData({
          ...existingJob,
          startDate: existingJob.startDate ? new Date(existingJob.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, existingJob]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };
  
  const addRequirementField = () => {
      setFormData(prev => ({...prev, requirements: [...prev.requirements, '']}));
  };
  
  const removeRequirementField = (index: number) => {
      setFormData(prev => ({...prev, requirements: prev.requirements.filter((_, i) => i !== index)}));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.orgName) {
        alert("Cannot post job. Foundation details are missing.");
        return;
    }
    const finalData = {
        ...formData,
        foundationName: currentUser.orgName
    };
    onSubmit(finalData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-swiss-charcoal">
            {existingJob ? t('recruitmentPage.jobPostModal.editTitle') : t('recruitmentPage.jobPostModal.addTitle')}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600" aria-label={t('buttons.close')}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">{t('recruitmentPage.jobPostModal.jobTitle')} *</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className={STANDARD_INPUT_FIELD} />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">{t('recruitmentPage.jobPostModal.location')} *</label>
                <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className={STANDARD_INPUT_FIELD} />
              </div>
              <div>
                <label htmlFor="contractType" className="block text-sm font-medium text-gray-700 mb-1">{t('recruitmentPage.jobPostModal.contractType')} *</label>
                <select name="contractType" id="contractType" value={formData.contractType} onChange={handleChange} required className={STANDARD_INPUT_FIELD}>
                  {['Full-time', 'Part-time', 'CDI', 'CDD', 'Internship'].map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">{t('recruitmentPage.jobPostModal.startDate')} *</label>
                <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} required className={STANDARD_INPUT_FIELD} />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">{t('recruitmentPage.jobPostModal.description')} *</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={5} className={STANDARD_INPUT_FIELD}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('recruitmentPage.jobPostModal.requirements')}</label>
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    className={`${STANDARD_INPUT_FIELD} flex-grow`}
                    placeholder={`${t('recruitmentPage.jobPostModal.requirementPlaceholder')} ${index + 1}`}
                  />
                  {formData.requirements.length > 1 && (
                    <Button type="button" variant="ghost" onClick={() => removeRequirementField(index)} className="text-swiss-coral !p-2">
                        <XMarkIcon className="w-5 h-5"/>
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addRequirementField}>
                {t('recruitmentPage.jobPostModal.addRequirement')}
              </Button>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
            <Button type="button" variant="light" onClick={onClose}>{t('buttons.cancel')}</Button>
            <Button type="submit" variant="primary">{existingJob ? t('buttons.saveChanges') : t('recruitmentPage.jobPostModal.postJob')}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostModal;