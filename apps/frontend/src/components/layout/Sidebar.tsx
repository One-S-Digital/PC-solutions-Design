import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon, ShoppingBagIcon, BriefcaseIcon, DocumentTextIcon, AcademicCapIcon, CogIcon, NewspaperIcon, PresentationChartLineIcon, BuildingOfficeIcon, UserCircleIcon, ChevronDownIcon, ChevronUpIcon, PuzzlePieceIcon, InboxArrowDownIcon, ClipboardDocumentListIcon, SquaresPlusIcon, QuestionMarkCircleIcon, ChatBubbleLeftEllipsisIcon, IdentificationIcon, CalendarDaysIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { useAppContext } from 'packages/contexts/src/AppContext';
import { UserRole } from 'packages/core/src/types';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

interface NavItem {
  path: string;
  nameKey: string;
  icon: React.ElementType;
  roles?: UserRole[];
  subItems?: NavItem[];
  exact?: boolean;
}

interface SidebarProps {
  onLinkClick?: () => void;
  isMobileView?: boolean;
}

const translateUserRole = (role: UserRole, t: TFunction): string => {
  const roleKey = `userRoles.${role}`;
  return t(roleKey, role);
};

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick, isMobileView }) => {
  const { t } = useTranslation();
  const { currentUser } = useAppContext();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'sidebar.marketplace': true,
    'sidebar.recruitment': true,
  });

  const toggleMenu = (nameKey: string) => { 
    setOpenMenus(prev => ({ ...prev, [nameKey]: !prev[nameKey] }));
  };
  
  const navItems: NavItem[] = [
    // Shared
    { path: '/messages', nameKey: 'sidebar.messages', icon: ChatBubbleLeftEllipsisIcon, roles: [UserRole.PRODUCT_SUPPLIER, UserRole.SERVICE_PROVIDER, UserRole.FOUNDATION, UserRole.EDUCATOR, UserRole.PARENT]},
    { path: '/settings', nameKey: 'sidebar.settings', icon: CogIcon, roles: [UserRole.FOUNDATION, UserRole.PARENT, UserRole.EDUCATOR, UserRole.PRODUCT_SUPPLIER, UserRole.SERVICE_PROVIDER] },
    
    // Supplier
    { path: '/supplier/dashboard', nameKey: 'sidebar.dashboard', icon: HomeIcon, roles: [UserRole.PRODUCT_SUPPLIER], exact: true },
    { path: '/supplier/orders', nameKey: 'sidebar.orders', icon: ShoppingBagIcon, roles: [UserRole.PRODUCT_SUPPLIER] },
    { path: '/supplier/product-listings', nameKey: 'sidebar.productMarketplace', icon: PuzzlePieceIcon, roles: [UserRole.PRODUCT_SUPPLIER] },
    { path: '/supplier/analytics', nameKey: 'sidebar.analytics', icon: PresentationChartLineIcon, roles: [UserRole.PRODUCT_SUPPLIER] },
    { path: '/supplier/support', nameKey: 'sidebar.support', icon: QuestionMarkCircleIcon, roles: [UserRole.PRODUCT_SUPPLIER] },

    // Service Provider
    { path: '/service-provider/dashboard', nameKey: 'sidebar.dashboard', icon: HomeIcon, roles: [UserRole.SERVICE_PROVIDER], exact: true },
    { path: '/service-provider/requests', nameKey: 'sidebar.myRequests', icon: InboxArrowDownIcon, roles: [UserRole.SERVICE_PROVIDER] },
    { path: '/service-provider/service-listings', nameKey: 'sidebar.serviceMarketplace', icon: BriefcaseIcon, roles: [UserRole.SERVICE_PROVIDER] },
    { path: '/service-provider/analytics', nameKey: 'sidebar.analytics', icon: PresentationChartLineIcon, roles: [UserRole.SERVICE_PROVIDER] },
    { path: '/service-provider/support', nameKey: 'sidebar.support', icon: QuestionMarkCircleIcon, roles: [UserRole.SERVICE_PROVIDER] },

    // Foundation
    { path: '/foundation/dashboard', nameKey: 'sidebar.dashboard', icon: HomeIcon, roles: [UserRole.FOUNDATION], exact: true },
    { path: '/marketplace', nameKey: 'sidebar.marketplace', icon: ShoppingBagIcon, roles: [UserRole.FOUNDATION],
      subItems: [
        { path: '/marketplace/products', nameKey: 'sidebar.products', icon: PuzzlePieceIcon, roles: [UserRole.FOUNDATION] },
        { path: '/marketplace/services', nameKey: 'sidebar.services', icon: BriefcaseIcon, roles: [UserRole.FOUNDATION] },
      ]
    },
    { path: '/foundation/orders-appointments', nameKey: 'sidebar.ordersAppointments', icon: CalendarDaysIcon, roles: [UserRole.FOUNDATION] },
    { path: '/foundation/leads', nameKey: 'sidebar.parentLeads', icon: InboxArrowDownIcon, roles: [UserRole.FOUNDATION] },
    { path: '/recruitment', nameKey: 'sidebar.recruitment', icon: BriefcaseIcon, roles: [UserRole.FOUNDATION],
      subItems: [
        { path: '/recruitment/job-listings', nameKey: 'sidebar.jobListings', icon: ClipboardDocumentListIcon, roles: [UserRole.FOUNDATION]},
        { path: '/recruitment/candidate-pool', nameKey: 'sidebar.candidatePool', icon: UserCircleIcon, roles: [UserRole.FOUNDATION]},
      ]
    },
    { path: '/hr-procedures', nameKey: 'sidebar.hrProcedures', icon: DocumentTextIcon, roles: [UserRole.FOUNDATION] },
    { path: '/e-learning', nameKey: 'sidebar.eLearning', icon: AcademicCapIcon, roles: [UserRole.FOUNDATION] },
    { path: '/state-policies', nameKey: 'sidebar.statePolicies', icon: NewspaperIcon, roles: [UserRole.FOUNDATION, UserRole.PRODUCT_SUPPLIER, UserRole.EDUCATOR, UserRole.PARENT] },
    { path: '/foundation/analytics', nameKey: 'sidebar.analytics', icon: PresentationChartLineIcon, roles: [UserRole.FOUNDATION] },
    { path: '/foundation/organisation-profile', nameKey: 'sidebar.organisationProfile', icon: BuildingOfficeIcon, roles: [UserRole.FOUNDATION] },
    { path: '/foundation/support', nameKey: 'sidebar.support', icon: QuestionMarkCircleIcon, roles: [UserRole.FOUNDATION] },
    
    // Educator
    { path: '/educator/dashboard', nameKey: 'sidebar.dashboard', icon: HomeIcon, roles: [UserRole.EDUCATOR], exact: true },
    { path: '/educator/job-board', nameKey: 'sidebar.jobBoard', icon: BriefcaseIcon, roles: [UserRole.EDUCATOR] },
    { path: '/educator/profile', nameKey: 'sidebar.myProfile', icon: IdentificationIcon, roles: [UserRole.EDUCATOR] },
    { path: '/educator/applications', nameKey: 'sidebar.applications', icon: ClipboardDocumentListIcon, roles: [UserRole.EDUCATOR] },
    { path: '/file-gallery', nameKey: 'sidebar.fileGallery', icon: PaperClipIcon, roles: [UserRole.EDUCATOR] },
    { path: '/educator/support', nameKey: 'sidebar.support', icon: QuestionMarkCircleIcon, roles: [UserRole.EDUCATOR] },

    // Parent
    { path: '/parent/dashboard', nameKey: 'sidebar.dashboard', icon: HomeIcon, roles: [UserRole.PARENT], exact: true },
    { path: '/parent/enquiries', nameKey: 'sidebar.myRequests', icon: ClipboardDocumentListIcon, roles: [UserRole.PARENT] },
    { path: '/parent/support', nameKey: 'sidebar.supportFAQ', icon: QuestionMarkCircleIcon, roles: [UserRole.PARENT] },
  ];

  const userSpecificNavItems = navItems.filter(item => 
    !item.roles || (currentUser && item.roles.includes(currentUser.role))
  );

  const NavLinkItem: React.FC<{ item: NavItem, isSubItem?: boolean }> = ({ item, isSubItem = false }) => (
     <NavLink
      to={item.path}
      end={item.exact} 
      onClick={onLinkClick}
      className={({ isActive }) =>
        `flex items-center px-4 py-2.5 text-sm rounded-button transition-colors duration-150 ease-in-out group ${
          isSubItem ? 'pl-10' : 'pl-4' 
        } ${isActive ? 'bg-swiss-mint/10 text-swiss-mint font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-swiss-charcoal'}`
      }
    >
      <item.icon className={`w-5 h-5 mr-3 group-hover:text-swiss-mint`} />
      {t(item.nameKey)}
    </NavLink>
  );

  return (
    <div className="w-full bg-white border-r border-gray-200/80 flex flex-col shadow-sm h-full">
      <div className="h-20 flex items-center justify-center px-6 border-b border-gray-200/80"> 
          <SquaresPlusIcon className="h-9 w-9 text-swiss-mint mr-2.5" />
          <h1 className="text-2xl font-bold text-swiss-charcoal">{t('appName')}</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto"> 
        {userSpecificNavItems.map((item) => (
            <div key={item.nameKey + item.path}>
              {item.subItems && item.subItems.length > 0 ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.nameKey)}
                    className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-swiss-charcoal rounded-button transition-colors duration-150 ease-in-out group"
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3 text-gray-500 group-hover:text-swiss-mint" />
                      <span className="font-medium">{t(item.nameKey)}</span>
                    </div>
                    {openMenus[item.nameKey] ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                  </button>
                  {openMenus[item.nameKey] && (
                    <div className="mt-1 ml-2 space-y-1"> 
                      {item.subItems.map((subItem) => (
                        <NavLinkItem key={subItem.nameKey + subItem.path} item={subItem} isSubItem={true} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLinkItem item={item} /> 
              )}
            </div>
          )
        )}
      </nav>
      <div className="p-5 border-t border-gray-200/80 mt-auto">
        {currentUser && (
           <div className="flex items-center mb-4">
            <img src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser.name.replace(' ', '+')}&background=48CFAE&color=fff&rounded=true&size=128`} alt={currentUser.name} className="w-11 h-11 rounded-full mr-3 border-2 border-swiss-mint/30" />
            <div>
              <p className="text-base font-semibold text-swiss-charcoal">{currentUser.name}</p>
              <p className="text-xs text-gray-500">{translateUserRole(currentUser.role, t)}</p>
            </div>
          </div>
        )}
        {currentUser && ![UserRole.PARENT].includes(currentUser.role) && (
          <div className="bg-swiss-sand/20 p-4 rounded-card text-center">
              <p className="text-sm text-swiss-charcoal font-semibold">{t('sidebar.premiumPlan')}</p>
              <p className="text-xs text-gray-600 mb-2.5">{t('sidebar.premiumPlanDesc')}</p>
              <button 
                onClick={() => {
                    navigate('/settings');
                    if (onLinkClick) onLinkClick();
                }}
                className="w-full bg-swiss-coral text-white text-sm px-4 py-2 rounded-button hover:bg-opacity-90 transition-colors shadow-soft">
                  {t('sidebar.managePlan')}
              </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
