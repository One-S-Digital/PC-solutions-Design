
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { STANDARD_INPUT_FIELD } from '../../constants';
import { BuildingOfficeIcon, PhotoIcon, PencilSquareIcon, GlobeAltIcon, BellIcon, DocumentArrowUpIcon, ClockIcon } from '@heroicons/react/24/outline';

const ServiceProviderCompanyProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState({
    aboutText: 'We offer specialized professional services including legal consultation, deep cleaning, and educational workshops tailored for daycare centers. Our team is certified and experienced in supporting the unique needs of early childhood facilities.',
    languagesSpoken: 'German, French, Italian',
    regionsServed: 'Geneva, Vaud, Zurich',
    bookingLink: 'https://cal.com/proservice-consult',
    avgResponseTime: '2 hours',
    newRequestEmail: true,
    weeklyDigest: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setProfileData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving service provider profile:", profileData);
    alert("Profile saved successfully!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-swiss-charcoal flex items-center">
        <BuildingOfficeIcon className="w-8 h-8 mr-3 text-swiss-mint" />
        Company Profile (Service Provider)
      </h1>
      <form onSubmit={handleSubmit}>
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-swiss-charcoal mb-4 flex items-center">
            <PhotoIcon className="w-6 h-6 mr-2 text-swiss-teal" />
            Branding
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="logoUpload" className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
              <input type="file" id="logoUpload" className={`${STANDARD_INPUT_FIELD} p-0 file:mr-4 file:py-2 file:px-4 file:rounded-l-button file:border-0 file:text-sm file:font-semibold file:bg-swiss-teal/10 file:text-swiss-teal hover:file:bg-swiss-teal/20`} />
            </div>
            <div>
              <label htmlFor="coverImageUpload" className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
              <input type="file" id="coverImageUpload" className={`${STANDARD_INPUT_FIELD} p-0 file:mr-4 file:py-2 file:px-4 file:rounded-l-button file:border-0 file:text-sm file:font-semibold file:bg-swiss-teal/10 file:text-swiss-teal hover:file:bg-swiss-teal/20`} />
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-swiss-charcoal mb-4 flex items-center">
            <PencilSquareIcon className="w-6 h-6 mr-2 text-swiss-teal" />
            About Your Services
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="aboutText" className="block text-sm font-medium text-gray-700 mb-1">About Text (max 500 chars)</label>
              <textarea
                id="aboutText"
                name="aboutText"
                rows={5}
                maxLength={500}
                value={profileData.aboutText}
                onChange={handleChange}
                className={STANDARD_INPUT_FIELD}
                placeholder="Describe your services, expertise, and unique selling points."
              />
              <p className="text-xs text-gray-500 text-right mt-1">{profileData.aboutText.length}/500</p>
            </div>
            <div>
              <label htmlFor="certificationsUpload" className="block text-sm font-medium text-gray-700 mb-1">Certifications (PDF)</label>
              <input type="file" id="certificationsUpload" accept=".pdf" className={`${STANDARD_INPUT_FIELD} p-0 file:mr-4 file:py-2 file:px-4 file:rounded-l-button file:border-0 file:text-sm file:font-semibold file:bg-swiss-teal/10 file:text-swiss-teal hover:file:bg-swiss-teal/20`} />
            </div>
            <div>
              <label htmlFor="languagesSpoken" className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
              <input type="text" id="languagesSpoken" name="languagesSpoken" value={profileData.languagesSpoken} onChange={handleChange} className={STANDARD_INPUT_FIELD} placeholder="e.g., English, German, French" />
            </div>
            <div>
              <label htmlFor="regionsServed" className="block text-sm font-medium text-gray-700 mb-1">Regions Served</label>
              <input type="text" id="regionsServed" name="regionsServed" value={profileData.regionsServed} onChange={handleChange} className={STANDARD_INPUT_FIELD} placeholder="e.g., Zurich, Geneva, All Switzerland" />
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-swiss-charcoal mb-4 flex items-center">
            <GlobeAltIcon className="w-6 h-6 mr-2 text-swiss-teal" />
            Booking Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="bookingLink" className="block text-sm font-medium text-gray-700 mb-1">Booking Link (e.g., Cal.com)</label>
              <input type="url" id="bookingLink" name="bookingLink" value={profileData.bookingLink} onChange={handleChange} className={STANDARD_INPUT_FIELD} placeholder="https://cal.com/your-service" />
            </div>
            <div>
              <label htmlFor="avgResponseTime" className="block text-sm font-medium text-gray-700 mb-1">Average Response Time Tag</label>
              <input type="text" id="avgResponseTime" name="avgResponseTime" value={profileData.avgResponseTime} onChange={handleChange} className={STANDARD_INPUT_FIELD} placeholder="e.g., Within 24 hours, Approx. 2 hours" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-swiss-charcoal mb-4 flex items-center">
            <BellIcon className="w-6 h-6 mr-2 text-swiss-teal" />
            Notification Settings
          </h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" name="newRequestEmail" checked={profileData.newRequestEmail} onChange={handleChange} className="h-4 w-4 text-swiss-mint border-gray-300 rounded focus:ring-swiss-mint" />
              <span className="ml-2 text-sm text-gray-700">Receive email for new service requests</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="weeklyDigest" checked={profileData.weeklyDigest} onChange={handleChange} className="h-4 w-4 text-swiss-mint border-gray-300 rounded focus:ring-swiss-mint" />
              <span className="ml-2 text-sm text-gray-700">Receive weekly digest email</span>
            </label>
          </div>
        </Card>

        <div className="mt-6">
          <Button type="submit" variant="primary" size="lg">Save Profile</Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceProviderCompanyProfilePage;
