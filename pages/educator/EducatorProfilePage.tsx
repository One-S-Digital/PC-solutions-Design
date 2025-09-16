
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { STANDARD_INPUT_FIELD } from '../../constants';
import { UserCircleIcon, IdentificationIcon, ArrowUpTrayIcon, CalendarDaysIcon, GlobeAltIcon, EnvelopeIcon, PhoneIcon, BriefcaseIcon, AcademicCapIcon, LanguageIcon } from '@heroicons/react/24/outline';

const EducatorProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState({
    fullName: 'Tom Fischer',
    avatarUrl: 'https://picsum.photos/seed/tomfischer/200/200',
    headline: 'Bilingual Early-Childhood Educator',
    about: 'Passionate and experienced educator with a focus on creating engaging learning environments. Strong skills in curriculum development and parent communication.',
    regionsCantons: 'Bern, Zurich',
    desiredRole: 'Educator', // Educator / Assistant / Admin
    availability: 'Immediate', // Immediate / Date
    availabilityDate: '',
    languages: 'German, English, French',
    cvFile: null as File | null,
    certificatesFiles: [] as File[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === 'cvFile') {
        setProfileData(prev => ({ ...prev, cvFile: files[0] }));
      } else if (name === 'certificatesFiles') {
        setProfileData(prev => ({ ...prev, certificatesFiles: Array.from(files) }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving educator profile:", profileData);
    // Logic to upload files would go here
    alert("Profile saved! It's now visible in the Candidate Pool for foundations.");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-swiss-charcoal flex items-center">
        <IdentificationIcon className="w-8 h-8 mr-3 text-swiss-mint" />
        My Profile (Setup in 5 min)
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 text-center">
              <img 
                src={profileData.avatarUrl || `https://ui-avatars.com/api/?name=${profileData.fullName.replace(' ', '+')}&background=48CFAE&color=fff&size=128`} 
                alt="Profile" 
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-swiss-mint/30 bg-gray-200"
              />
              <input type="file" id="avatarUpload" className="text-xs text-center mx-auto block w-full max-w-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-swiss-teal/10 file:text-swiss-teal hover:file:bg-swiss-teal/20" />
              <p className="text-xs text-gray-500 mt-1">Optional Avatar</p>
            </Card>
            <Card className="p-6">
                 <h2 className="text-lg font-semibold text-swiss-charcoal mb-3">Contact & Availability</h2>
                 <div className="space-y-3">
                    <div>
                        <label htmlFor="desiredRole" className="block text-sm font-medium text-gray-700 mb-1">Desired Role</label>
                        <select id="desiredRole" name="desiredRole" value={profileData.desiredRole} onChange={handleChange} className={STANDARD_INPUT_FIELD}>
                            <option>Educator</option>
                            <option>Assistant</option>
                            <option>Admin</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                        <select id="availability" name="availability" value={profileData.availability} onChange={handleChange} className={STANDARD_INPUT_FIELD}>
                            <option value="Immediate">Immediate</option>
                            <option value="Date">Specific Date</option>
                        </select>
                    </div>
                    {profileData.availability === 'Date' && (
                        <div>
                            <label htmlFor="availabilityDate" className="block text-sm font-medium text-gray-700 mb-1">Available From Date</label>
                            <input type="date" id="availabilityDate" name="availabilityDate" value={profileData.availabilityDate} onChange={handleChange} className={STANDARD_INPUT_FIELD} />
                        </div>
                    )}
                     <div>
                        <label htmlFor="languages" className="block text-sm font-medium text-gray-700 mb-1">Languages (EN/FR/DE checkboxes)</label>
                        {/* Replace with actual checkboxes or multi-select component */}
                        <input type="text" id="languages" name="languages" value={profileData.languages} onChange={handleChange} className={STANDARD_INPUT_FIELD} placeholder="e.g., English, German" />
                        <p className="text-xs text-gray-500 mt-1">Separate with commas. (Mock: Checkboxes ideally)</p>
                    </div>
                 </div>
            </Card>
          </div>

          {/* Right Column: Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-swiss-charcoal mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" id="fullName" name="fullName" value={profileData.fullName} onChange={handleChange} className={STANDARD_INPUT_FIELD} required />
                </div>
                <div>
                  <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                  <input type="text" id="headline" name="headline" value={profileData.headline} onChange={handleChange} className={STANDARD_INPUT_FIELD} placeholder='e.g., "Bilingual Early-Childhood Educator"' />
                </div>
                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">About (Short Bio - max 150 chars)</label>
                  <textarea id="about" name="about" value={profileData.about} onChange={handleChange} rows={3} maxLength={150} className={STANDARD_INPUT_FIELD}></textarea>
                  <p className="text-xs text-gray-500 text-right mt-1">{profileData.about.length}/150</p>
                </div>
                 <div>
                  <label htmlFor="regionsCantons" className="block text-sm font-medium text-gray-700 mb-1">Regions / Cantons (Multi-select)</label>
                  {/* Replace with actual multi-select component */}
                  <input type="text" id="regionsCantons" name="regionsCantons" value={profileData.regionsCantons} onChange={handleChange} className={STANDARD_INPUT_FIELD} placeholder="e.g., Bern, Zurich" />
                   <p className="text-xs text-gray-500 mt-1">Separate with commas. (Mock: Multi-select ideally)</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
                <h2 className="text-lg font-semibold text-swiss-charcoal mb-4">Documents</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="cvFile" className="block text-sm font-medium text-gray-700 mb-1">Upload CV (PDF)</label>
                        <input type="file" id="cvFile" name="cvFile" accept=".pdf" onChange={handleFileChange} className={`${STANDARD_INPUT_FIELD} p-0 file:mr-4 file:py-2 file:px-4 file:rounded-l-button file:border-0 file:text-sm file:font-semibold file:bg-swiss-teal/10 file:text-swiss-teal hover:file:bg-swiss-teal/20`} />
                        {profileData.cvFile && <p className="text-xs text-gray-500 mt-1">Selected: {profileData.cvFile.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="certificatesFiles" className="block text-sm font-medium text-gray-700 mb-1">Certificates (PDF/JPG, max 5 files)</label>
                        <input type="file" id="certificatesFiles" name="certificatesFiles" accept=".pdf,.jpg,.jpeg" multiple onChange={handleFileChange} className={`${STANDARD_INPUT_FIELD} p-0 file:mr-4 file:py-2 file:px-4 file:rounded-l-button file:border-0 file:text-sm file:font-semibold file:bg-swiss-teal/10 file:text-swiss-teal hover:file:bg-swiss-teal/20`} />
                        {profileData.certificatesFiles.length > 0 && (
                            <ul className="mt-1 list-disc list-inside text-xs text-gray-500">
                                {profileData.certificatesFiles.map(f => <li key={f.name}>{f.name}</li>)}
                            </ul>
                        )}
                         <p className="text-xs text-gray-500 mt-1">E.g., First-aid, childcare diplomas.</p>
                    </div>
                </div>
            </Card>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <Button type="submit" variant="primary" size="lg">Save Profile</Button>
        </div>
      </form>
    </div>
  );
};

export default EducatorProfilePage;
