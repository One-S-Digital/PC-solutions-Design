

import React, { useState, useEffect, FormEvent } from 'react';
// FIX: Update import paths for monorepo structure
import { UserRole, UploadableContentType, LanguageCode, Course, HRDocument, PolicyDocument, ELearningContentType, ELearningCategory, ELEARNING_CATEGORIES, HRCategory, HR_CATEGORIES, PolicyBroadCategory, POLICY_BROAD_CATEGORIES, SWISS_CANTONS, PolicyType } from 'packages/core/src/types';
// FIX: Update import paths for monorepo structure and correct typo 'CountryForPolicies' to 'COUNTRIES_FOR_POLICIES'.
import { COUNTRIES_FOR_POLICIES, REGIONS_BY_COUNTRY, STANDARD_INPUT_FIELD } from 'packages/core/src/constants'; 
import Button from '../ui/Button';
// import Card from '../ui/Card'; // Not used directly for modal
import { XMarkIcon, PaperClipIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface ContentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Course | HRDocument | PolicyDocument>, file?: File) => void;
  contentType: UploadableContentType;
  existingContent?: Course | HRDocument | PolicyDocument | null; // Added for editing
}

type FormData = {
  title?: string;
  description?: string; 
  contentPreview?: string; // For PolicyDocument specific preview if needed distinct from form's description
  category?: ELearningCategory | HRCategory | PolicyBroadCategory;
  type?: ELearningContentType; 
  policyType?: PolicyType; 
  language?: LanguageCode;
  accessRoles?: UserRole[];
  fileType?: 'PDF' | 'DOCX' | 'XLSX' | 'DOC'; // DOC added for policy
  country?: typeof COUNTRIES_FOR_POLICIES[number]; 
  region?: string; 
  isCritical?: boolean; 
  lessons?: number; 
  duration?: string; 
  fileUrl?: string; 
  externalLink?: string; 
  effectiveDate?: string; 
  status?: PolicyDocument['status'] | Course['status'] | HRDocument['status'];
  version?: string; 
  tags?: string[]; 
  // Removed duplicate contentPreview here
};


const ContentUploadModal: React.FC<ContentUploadModalProps> = ({ isOpen, onClose, onSubmit, contentType, existingContent }) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const getInitialFormState = (): FormData => ({
    title: '',
    description: '', 
    contentPreview: '',
    category: (contentType === 'e-learning' ? ELEARNING_CATEGORIES[0] : contentType === 'hr' ? HR_CATEGORIES[0] : POLICY_BROAD_CATEGORIES[0]) as ELearningCategory | HRCategory | PolicyBroadCategory,
    type: contentType === 'e-learning' ? ELearningContentType.COURSE : undefined, 
    policyType: contentType === 'policy' ? PolicyType.REGULATION : undefined, 
    language: 'EN',
    accessRoles: contentType === 'e-learning' ? [UserRole.FOUNDATION] : undefined,
    fileType: contentType === 'hr' ? 'PDF' : contentType === 'policy' ? 'PDF' : undefined,
    country: contentType === 'policy' ? COUNTRIES_FOR_POLICIES[0] : undefined,
    region: contentType === 'policy' ? REGIONS_BY_COUNTRY[COUNTRIES_FOR_POLICIES[0]][0] : undefined,
    isCritical: false,
    tags: [],
    status: 'Draft', // Default status
  });

  const [formData, setFormData] = useState<FormData>(getInitialFormState());
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (existingContent) {
        // Map existing content to FormData
        const mappedData: FormData = {
          title: existingContent.title,
          description: (existingContent as Course).description || (existingContent as PolicyDocument).contentPreview || '', // E-learning has description, Policy has contentPreview
          category: existingContent.category as any, // Assuming category types align
          language: (existingContent as any).language || 'EN',
          tags: (existingContent as any).tags || [],
          status: (existingContent as any).status || 'Draft',
        };
        if (contentType === 'e-learning') {
          const ec = existingContent as Course;
          mappedData.type = ec.type as ELearningContentType; // Cast here
          mappedData.accessRoles = ec.accessRoles;
          mappedData.lessons = ec.lessons;
          mappedData.duration = ec.duration;
          mappedData.fileUrl = ec.fileUrl;
        } else if (contentType === 'hr') {
          const hr = existingContent as HRDocument;
          mappedData.fileType = hr.fileType;
          mappedData.version = hr.version;
        } else if (contentType === 'policy') {
          const pol = existingContent as PolicyDocument;
          mappedData.policyType = pol.policyType;
          mappedData.country = pol.country as typeof COUNTRIES_FOR_POLICIES[number];
          mappedData.region = pol.region;
          mappedData.isCritical = pol.isCritical;
          mappedData.fileType = pol.fileType as 'PDF' | 'DOC';
          mappedData.externalLink = pol.externalLink;
          mappedData.effectiveDate = pol.effectiveDate ? new Date(pol.effectiveDate).toISOString().split('T')[0] : undefined;
          mappedData.contentPreview = pol.contentPreview; // Explicitly map contentPreview from existing data
        }
        setFormData(mappedData);
      } else {
        setFormData(getInitialFormState());
      }
      setFile(null);
      setUploadProgress(0);
      setIsUploading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, contentType, existingContent]);
  
   useEffect(() => {
    if (formData.country && contentType === 'policy') {
      const validRegions = REGIONS_BY_COUNTRY[formData.country];
      if (!validRegions.includes(formData.region || '')) {
        setFormData(prev => ({ ...prev, region: validRegions[0] }));
      }
    }
  }, [formData.country, contentType]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        if (name === "accessRoles") {
            const role = value as UserRole;
            setFormData(prev => ({
                ...prev,
                accessRoles: checked 
                    ? [...(prev.accessRoles || []), role]
                    : (prev.accessRoles || []).filter(r => r !== role)
            }));
        } else {
             setFormData(prev => ({ ...prev, [name]: checked }));
        }
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleButtonSelectChange = (name: keyof FormData, value: string | UserRole[] | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    const submissionData: any = { ...formData };
    if (contentType === 'policy' && formData.description) {
        submissionData.contentPreview = formData.description;
    }


    if (file || (contentType === 'e-learning' && formData.type === ELearningContentType.LINK && formData.fileUrl) || existingContent) { 
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 20;
        setUploadProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (file) submissionData.fileName = file.name; 
            if (contentType === 'e-learning') {
                if (submissionData.type !== ELearningContentType.COURSE) delete submissionData.lessons;
                if (submissionData.type !== ELearningContentType.VIDEO && submissionData.type !== ELearningContentType.COURSE) delete submissionData.duration;
                if (submissionData.type === ELearningContentType.LINK && file) { delete submissionData.fileName; }
                else if (submissionData.type !== ELearningContentType.LINK) { delete submissionData.fileUrl; }
            }
            onSubmit(submissionData, file || undefined);
            setIsUploading(false);
            onClose();
          }, 500);
        }
      }, 200);
    } else if (contentType === 'policy' && (formData.externalLink || formData.description)) { 
       onSubmit(submissionData);
       setIsUploading(false);
       onClose();
    } else if (contentType !== 'e-learning' || formData.type !== ELearningContentType.LINK) {
      alert(t('contentUploadModal.error.selectFileOrLink'));
      setIsUploading(false);
      return;
    } else { 
       onSubmit(submissionData); 
       setIsUploading(false);
       onClose();
    }
  };

  if (!isOpen) return null;

  const titleText = existingContent 
    ? t('contentUploadModal.title.edit', { contentType: t(`contentUploadModal.contentType.${contentType}`)}) 
    : t(`contentUploadModal.title.add.${contentType}`);
  
  const descriptionLabel = contentType === 'policy' ? t('contentUploadModal.labels.descriptionPreview') : t('contentUploadModal.labels.description');
  const descriptionMaxLength = contentType === 'policy' ? 300 : (contentType === 'e-learning' ? 300 : undefined);
  const policySpecificInputClass = `${STANDARD_INPUT_FIELD} mt-1`;


  const languageOptions: { value: LanguageCode; label: string }[] = [
    { value: 'EN', label: t('languageSwitcher.enShort') },
    { value: 'FR', label: t('languageSwitcher.frShort') },
    { value: 'DE', label: t('languageSwitcher.deShort') },
  ];
  
  const renderButtonSelect = (
    name: keyof FormData,
    currentValue: string | undefined,
    options: { value: string; label: string }[],
    label?: string,
    isRequired?: boolean
  ) => (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}{isRequired && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <div className="flex space-x-2">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleButtonSelectChange(name, opt.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-colors duration-150
              ${currentValue === opt.value
                ? 'bg-swiss-mint text-white border-swiss-mint'
                : 'bg-white text-gray-700 border-gray-300 hover:border-swiss-teal hover:text-swiss-teal'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderELearningFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">{t('contentUploadModal.labels.title')} <span className="text-red-500 ml-0.5">*</span></label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} required className={`${STANDARD_INPUT_FIELD} mt-1`} maxLength={60} />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">{t('contentUploadModal.labels.category')} <span className="text-red-500 ml-0.5">*</span></label>
          <select name="category" id="category" value={formData.category} onChange={handleInputChange} required className={`${STANDARD_INPUT_FIELD} mt-1`}>
            {ELEARNING_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">{descriptionLabel}</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={3} className={`${STANDARD_INPUT_FIELD} mt-1`} maxLength={300}></textarea>
        {formData.description && <p className="text-xs text-gray-400 text-right mt-0.5">{formData.description.length}/{300}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* FIX: Cast enum value to string before using string method and cast t() to string */}
        {renderButtonSelect('type', formData.type, Object.values(ELearningContentType).map(v => ({value: v as string, label: t(`contentUploadModal.eLearningTypes.${(v as string).toLowerCase()}` as const, v) as string})), t('contentUploadModal.labels.contentType'), true)}
        {renderButtonSelect('language', formData.language, languageOptions, t('contentUploadModal.labels.language'), true)}
      </div>
      {(formData.type === ELearningContentType.COURSE || formData.type === ELearningContentType.VIDEO) && (
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">{t('contentUploadModal.labels.duration')}</label>
          <input type="text" name="duration" id="duration" value={formData.duration || ''} onChange={handleInputChange} className={`${STANDARD_INPUT_FIELD} mt-1`} placeholder={t('contentUploadModal.placeholders.duration')}/>
        </div>
      )}
      {formData.type === ELearningContentType.COURSE && (
        <div>
          <label htmlFor="lessons" className="block text-sm font-medium text-gray-700 mb-1">{t('contentUploadModal.labels.lessons')}</label>
          <input type="number" name="lessons" id="lessons" value={formData.lessons || ''} onChange={handleInputChange} className={`${STANDARD_INPUT_FIELD} mt-1`} min="1"/>
        </div>
      )}
      {formData.type === ELearningContentType.LINK && (
        <div>
          <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700 mb-1">{t('contentUploadModal.labels.linkUrl')} <span className="text-red-500 ml-0.5">*</span></label>
          <input type="url" name="fileUrl" id="fileUrl" value={formData.fileUrl || ''} onChange={handleInputChange} required className={`${STANDARD_INPUT_FIELD} mt-1`} placeholder={t('contentUploadModal.placeholders.linkUrl')}/>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentUploadModal.labels.accessRoles')}</label>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {Object.values(UserRole).filter(r => r === UserRole.FOUNDATION || r === UserRole.EDUCATOR).map(role => (
              <div key={role} className="flex items-center">
                  <input
                      type="checkbox"
                      id={`role-${role}`}
                      name="accessRoles"
                      value={role}
                      checked={(formData.accessRoles || []).includes(role)}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-swiss-mint border-gray-300 rounded focus:ring-swiss-mint"
                  />
                  <label htmlFor={`role-${role}`} className="ml-2 text-sm text-gray-700">{role}</label>
              </div>
          ))}
        </div>
      </div>
    </>
  );

  // FIX: Added function closing and component export
  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
             <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                 <h2 id="contentUploadModalTitle" className="text-xl font-semibold text-swiss-charcoal">{titleText}</h2>
                 <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" aria-label={t('buttons.close') as string}><XMarkIcon className="w-6 h-6" /></button>
             </div>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[calc(80vh - 120px)] overflow-y-auto">
                    {contentType === 'e-learning' && renderELearningFields()}
                    {/* Render fields for other content types here */}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                    <Button type="button" variant="light" onClick={onClose}>{t('buttons.cancel')}</Button>
                    <Button type="submit" variant="primary" className="bg-swiss-mint">{existingContent ? t('buttons.saveChanges') : t('buttons.add')}</Button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default ContentUploadModal;
