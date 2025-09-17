
import React, { useState, useEffect, FormEvent } from 'react';
import { UserRole, UploadableContentType, LanguageCode, Course, HRDocument, PolicyDocument, ELearningContentType, ELearningCategory, ELEARNING_CATEGORIES, HRCategory, HR_CATEGORIES, PolicyBroadCategory, POLICY_BROAD_CATEGORIES, SWISS_CANTONS, PolicyType } from 'packages/core/src/types';
import { COUNTRIES_FOR_POLICIES, REGIONS_BY_COUNTRY, STANDARD_INPUT_FIELD } from 'packages/core/src/constants'; 
import Button from 'packages/ui/src/components/Button';
import { XMarkIcon, PaperClipIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface ContentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Course | HRDocument | PolicyDocument>, file?: File) => void;
  contentType: UploadableContentType;
  existingContent?: Course | HRDocument | PolicyDocument | null;
}

type FormData = Partial<Omit<Course & HRDocument & PolicyDocument, 'id' | 'lastUpdated' | 'updatedDate' | 'publishedDate' | 'lastUpdatedDate'>>;

const ContentUploadModal: React.FC<ContentUploadModalProps> = ({ isOpen, onClose, onSubmit, contentType, existingContent }) => {
  const { t } = useTranslation();
  
  const getInitialFormState = (): FormData => ({
    title: '',
    description: '', 
    contentPreview: '',
    category: (contentType === 'e-learning' ? ELEARNING_CATEGORIES[0] : contentType === 'hr' ? HR_CATEGORIES[0] : POLICY_BROAD_CATEGORIES[0]) as any,
    type: contentType === 'e-learning' ? ELearningContentType.COURSE : undefined, 
    policyType: contentType === 'policy' ? PolicyType.REGULATION : undefined, 
    language: 'EN',
    accessRoles: contentType === 'e-learning' ? [UserRole.FOUNDATION] : undefined,
    fileType: 'PDF',
    country: contentType === 'policy' ? COUNTRIES_FOR_POLICIES[0] : undefined,
    region: contentType === 'policy' ? REGIONS_BY_COUNTRY[COUNTRIES_FOR_POLICIES[0]][0] : undefined,
    isCritical: false,
    tags: [],
    status: 'Draft',
  });

  const [formData, setFormData] = useState<FormData>(getInitialFormState());
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (existingContent) {
        const mappedData: FormData = {
          ...existingContent,
          description: (existingContent as Course).description || (existingContent as PolicyDocument).contentPreview || '',
          category: existingContent.category as any,
          language: (existingContent as any).language || 'EN',
          tags: (existingContent as any).tags || [],
          status: (existingContent as any).status || 'Draft',
          type: (existingContent as Course).type,
          accessRoles: (existingContent as Course).accessRoles,
          lessons: (existingContent as Course).lessons,
          duration: (existingContent as Course).duration,
          fileUrl: (existingContent as Course).fileUrl,
          fileType: (existingContent as any).fileType,
          version: (existingContent as HRDocument).version,
          policyType: (existingContent as PolicyDocument).policyType,
          country: (existingContent as PolicyDocument).country as any,
          region: (existingContent as PolicyDocument).region,
          isCritical: (existingContent as PolicyDocument).isCritical,
          externalLink: (existingContent as PolicyDocument).externalLink,
          effectiveDate: (existingContent as PolicyDocument).effectiveDate ? new Date((existingContent as PolicyDocument).effectiveDate!).toISOString().split('T')[0] : undefined,
          contentPreview: (existingContent as PolicyDocument).contentPreview,
        };
        setFormData(mappedData);
      } else {
        setFormData(getInitialFormState());
      }
      setFile(null);
    }
  }, [isOpen, contentType, existingContent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const { checked } = e.target as HTMLInputElement;
    if (type === 'checkbox' && name === 'accessRoles') {
      const role = value as UserRole;
      setFormData(prev => ({ ...prev, accessRoles: checked ? [...(prev.accessRoles || []), role] : (prev.accessRoles || []).filter(r => r !== role) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData, file || undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-swiss-charcoal">{existingContent ? 'Edit Content' : 'Add Content'}</h2>
          <button onClick={onClose}><XMarkIcon className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Form fields will be rendered here based on contentType */}
            <p>Form for {contentType} goes here.</p>
            <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} placeholder="Title" className={STANDARD_INPUT_FIELD} />
          </div>
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <Button type="button" variant="light" onClick={onClose}>{t('buttons.cancel')}</Button>
            <Button type="submit" variant="primary">{existingContent ? t('buttons.saveChanges') : t('buttons.add')}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentUploadModal;
