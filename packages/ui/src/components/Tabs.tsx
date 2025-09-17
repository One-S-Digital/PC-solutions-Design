import React, { ReactNode } from 'react';

interface Tab {
  label: string;
  content: ReactNode;
  icon?: React.ElementType;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: number;
  onTabChange: (index: number) => void;
  variant?: 'line' | 'pills';
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, variant = 'line', className = '' }) => {
  return (
    <div className={className}>
      <div className={`flex mb-5 ${variant === 'line' ? 'border-b border-gray-200' : 'space-x-1 bg-gray-100 p-1.5 rounded-lg'}`}>
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            className={`flex items-center justify-center font-medium transition-colors duration-200 ease-in-out focus:outline-none text-sm
              ${variant === 'line' 
                ? `border-b-2 pb-2 px-1 mx-2 ${activeTab === index ? 'border-swiss-mint text-swiss-mint' : 'border-transparent text-gray-500 hover:text-swiss-teal'}`
                : `rounded-button px-4 py-2 ${activeTab === index ? 'bg-swiss-mint text-white shadow-soft' : 'text-gray-600 hover:bg-gray-200/70'}`
              }`}
            onClick={() => onTabChange(index)}
          >
            {tab.icon && React.createElement(tab.icon, {className: "w-5 h-5 mr-2"})}
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {tabs[activeTab] && tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
