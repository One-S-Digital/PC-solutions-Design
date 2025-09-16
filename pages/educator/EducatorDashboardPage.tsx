
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { BriefcaseIcon, CheckCircleIcon, UserCircleIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../../contexts/AppContext';

interface DashboardTileProps {
  title: string;
  metric: string;
  actionText: string;
  onActionClick: () => void;
  icon: React.ElementType;
  color: string;
}

const DashboardTile: React.FC<DashboardTileProps> = ({ title, metric, actionText, onActionClick, icon: Icon, color }) => (
  <Card className="p-0 overflow-hidden group" hoverEffect>
    <div className="p-5">
      <div className="flex justify-between items-start">
        <div className={`p-2.5 inline-flex rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
      <h3 className="text-3xl font-semibold text-swiss-charcoal mt-3">{metric}</h3>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
    <button
      onClick={onActionClick}
      className={`block w-full px-5 py-2.5 text-xs text-center font-medium bg-${color}-50 text-${color}-600 hover:bg-${color}-100 transition-colors duration-150`}
      aria-label={`View details for ${title}`}
    >
      {actionText} &rarr;
    </button>
  </Card>
);

const EducatorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();

  const tiles = [
    { title: 'Open Jobs Near You', metric: '15', actionText: 'Go to Job Board', onActionClick: () => navigate('/educator/job-board'), icon: BriefcaseIcon, color: 'swiss-mint' },
    { title: 'Applications Submitted', metric: '3', actionText: 'View Applications', onActionClick: () => navigate('/educator/applications'), icon: CheckCircleIcon, color: 'swiss-sand' },
    { title: 'Profile Strength', metric: '80%', actionText: 'Complete My Profile', onActionClick: () => navigate('/educator/profile'), icon: UserCircleIcon, color: 'swiss-teal' },
  ];
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-swiss-charcoal">
          Educator / Job-Seeker Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Welcome, {currentUser?.name?.split(' ')[0]}! Your career hub.</p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-swiss-charcoal mb-4">Dashboard Snapshot</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted to 3 cols for these tiles */}
          {tiles.map(tile => (
            <DashboardTile
              key={tile.title}
              title={tile.title}
              metric={tile.metric}
              actionText={tile.actionText}
              onActionClick={tile.onActionClick}
              icon={tile.icon}
              color={tile.color.replace('swiss-','')}
            />
          ))}
        </div>
      </section>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-swiss-charcoal mb-3 flex items-center">
            <AcademicCapIcon className="w-6 h-6 mr-2 text-swiss-coral"/>
            Recommended E-Learning
        </h2>
        <p className="text-gray-600">Based on your profile, you might be interested in "Advanced Montessori Principles" or "Child Safety 101".</p>
        <button onClick={() => navigate('/e-learning')} className="mt-3 text-sm text-swiss-mint hover:underline">Browse E-Learning &rarr;</button>
      </Card>

    </div>
  );
};

export default EducatorDashboardPage;
