

import React, { useState, useEffect, FormEvent } from 'react';
// FIX: Update import paths for monorepo structure
import { PolicyAlert, PolicyAlertType, SWISS_CANTONS, SwissCanton } from 'packages/core/src/types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { XMarkIcon } from '@heroicons/react/24/outline';
// FIX: Update import paths for monorepo structure
import { STANDARD_INPUT_FIELD } from 'packages/core/src/constants';
import { useTranslation } from 'react-i18next';

interface PolicyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (alertData: Omit<PolicyAlert, 'id' | 'creationDate'>) => void;
  existingAlert?: PolicyAlert | null; // For editing
}

// FIX: Changed from default export to named export to resolve module resolution issues.
export const PolicyAlertModal: React.FC<PolicyAlertModalProps> = ({ isOpen, onClose, onSubmit, existingAlert }) => {
  const { t } = useTranslation();
  const initialFormState: Omit<PolicyAlert, 'id' | 'creationDate'> = {
    title: '',
    message: '',
    type: PolicyAlertType.INFO,
    regionScope: 'All',
    isActive: true,
    displayStartDate: '',
    displayEndDate: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isOpen) {
      if (existingAlert) {
        setFormData({
            ...existingAlert,
            displayStartDate: existingAlert.displayStartDate ? existingAlert.displayStartDate.split('T')[0] : '', // Format for date input
            displayEndDate: existingAlert.displayEndDate ? existingAlert.displayEndDate.split('T')[0] : '',
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, existingAlert]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
        alert("Title and Message are required.");
        return;
    }
    onSubmit({
        ...formData,
        displayStartDate: formData.displayStartDate || undefined, // Ensure empty strings become undefined
        displayEndDate: formData.displayEndDate || undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  const cantonOptions: ('All' | SwissCanton)[] = ['All', ...SWISS_CANTONS];

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog" aria-modal="true" aria-labelledby="policyAlertModalTitle">
      <Card className="w-full max-w-lg bg-white p-0 shadow-xl rounded-lg overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 id="policyAlertModalTitle" className="text-xl font-semibold text-swiss-charcoal">
            {existingAlert ? t('policyAlertModal.editTitle') : t('policyAlertModal.addTitle')}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" aria-label={t('buttons.close') as string}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">{t('policyAlertModal.labels.title')} *</label>
              <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className={`${STANDARD_INPUT_FIELD} mt-1`} maxLength={100} />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">{t('policyAlertModal.labels.message')} *</label>
              <textarea name="message" id="message" value={formData.message} onChange={handleChange} required rows={4} className={`${STANDARD_INPUT_FIELD} mt-1`} maxLength={500}></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">{t('policyAlertModal.labels.type')} *</label>
                <select name="type" id="type" value={formData.type} onChange={handleChange} required className={`${STANDARD_INPUT_FIELD} mt-1`}>
                  {Object.values(PolicyAlertType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="regionScope" className="block text-sm font-medium text-gray-700">{t('policyAlertModal.labels.regionScope')} *</label>
                <select name="regionScope" id="regionScope" value={formData.regionScope} onChange={handleChange} required className={`${STANDARD_INPUT_FIELD} mt-1`}>
                  {cantonOptions.map((canton) => <option key={canton} value={canton}>{canton === 'All' ? t('policyAlertModal.allSwitzerland') : canton}</option>)}
                </select>
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="displayStartDate" className="block text-sm font-medium text-gray-700">{t('policyAlertModal.labels.startDate')}</label>
                    <input type="date" name="displayStartDate" id="displayStartDate" value={formData.displayStartDate} onChange={handleChange} className={`${STANDARD_INPUT_FIELD} mt-1`} />
                </div>
                <div>
                    <label htmlFor="displayEndDate" className="block text-sm font-medium text-gray-700">{t('policyAlertModal.labels.endDate')}</label>
                    <input type="date" name="displayEndDate" id="displayEndDate" value={formData.displayEndDate} onChange={handleChange} className={`${STANDARD_INPUT_FIELD} mt-1`} />
                </div>
            </div>
            {/* FIX: Complete file and add isActive checkbox to prevent type errors */}
            <div className="flex items-center pt-2">
                <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-swiss-mint border-gray-300 rounded focus:ring-swiss-mint"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  {t('policyAlertModal.labels.isActive')}
                </label>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Button type="button" variant="light" onClick={onClose}>{t('buttons.cancel')}</Button>
            <Button type="submit" variant="primary">{existingAlert ? t('buttons.saveChanges') : t('policyAlertModal.createButton')}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
