import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { useAppContext } from 'packages/contexts/src/AppContext';
import { UserRole } from 'packages/core/src/types';

// Dynamically import all page components
const MarketplacePage = React.lazy(() => import('./pages/MarketplacePage'));
const RecruitmentPage = React.lazy(() => import('./pages/RecruitmentPage'));
const HRProceduresPage = React.lazy(() => import('./pages/HRProceduresPage'));
const StatePoliciesPage = React.lazy(() => import('./pages/StatePoliciesPage'));
const ELearningPage = React.lazy(() => import('./pages/ELearningPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const ParentLeadFormPage = React.lazy(() => import('./pages/ParentLeadFormPage'));
const ParentEnquiriesPage = React.lazy(() => import('./pages/parent/ParentEnquiriesPage'));
const FoundationLeadsPage = React.lazy(() => import('./pages/foundation/FoundationLeadsPage'));
const PartnerDetailPage = React.lazy(() => import('./pages/partner/PartnerDetailPage')); 
const CandidateProfilePage = React.lazy(() => import('./pages/candidate/CandidateProfilePage'));
const MessagesPage = React.lazy(() => import('./pages/MessagesPage')); 
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage'));
const FileGalleryPage = React.lazy(() => import('./pages/FileGalleryPage'));
const SupplierDashboardPage = React.lazy(() => import('./pages/supplier/SupplierDashboardPage'));
const SupplierOrdersPage = React.lazy(() => import('./pages/supplier/SupplierOrdersPage'));
const SupplierProductListingsPage = React.lazy(() => import('./pages/supplier/SupplierProductListingsPage'));
const SupplierAnalyticsPage = React.lazy(() => import('./pages/supplier/SupplierAnalyticsPage'));
const SupplierSupportPage = React.lazy(() => import('./pages/supplier/SupplierSupportPage'));
const ServiceProviderDashboardPage = React.lazy(() => import('./pages/service-provider/ServiceProviderDashboardPage'));
const ServiceProviderRequestsPage = React.lazy(() => import('./pages/service-provider/ServiceProviderRequestsPage'));
const ServiceProviderListingsPage = React.lazy(() => import('./pages/service-provider/ServiceProviderListingsPage'));
const ServiceProviderAnalyticsPage = React.lazy(() => import('./pages/service-provider/ServiceProviderAnalyticsPage'));
const ServiceProviderSupportPage = React.lazy(() => import('./pages/service-provider/ServiceProviderSupportPage'));
const FoundationDashboardPage = React.lazy(() => import('./pages/foundation/FoundationDashboardPage'));
const FoundationOrdersAppointmentsPage = React.lazy(() => import('./pages/foundation/FoundationOrdersAppointmentsPage'));
const FoundationAnalyticsPage = React.lazy(() => import('./pages/foundation/FoundationAnalyticsPage'));
const FoundationOrganisationProfilePage = React.lazy(() => import('./pages/foundation/FoundationOrganisationProfilePage'));
const FoundationSupportPage = React.lazy(() => import('./pages/foundation/FoundationSupportPage'));
const EducatorDashboardPage = React.lazy(() => import('./pages/educator/EducatorDashboardPage'));
const EducatorJobBoardPage = React.lazy(() => import('./pages/educator/EducatorJobBoardPage'));
const EducatorProfilePage = React.lazy(() => import('./pages/educator/EducatorProfilePage'));
const EducatorApplicationsPage = React.lazy(() => import('./pages/educator/EducatorApplicationsPage'));
const EducatorSupportPage = React.lazy(() => import('./pages/educator/EducatorSupportPage'));
const ParentDashboardPage = React.lazy(() => import('./pages/parent/ParentDashboardPage'));
const ParentSupportPage = React.lazy(() => import('./pages/parent/ParentSupportPage'));
const PricingPage = React.lazy(() => import('./pages/PricingPage'));
const PartnersPage = React.lazy(() => import('./pages/PartnersPage'));

// FIX: Changed children type from JSX.Element to React.ReactElement to resolve namespace error
const ProtectedRoute: React.FC<{ children: React.ReactElement; roles: UserRole[] }> = ({ children, roles }) => {
  const { currentUser } = useAppContext();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (!roles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const RoleBasedDashboardRedirect: React.FC = () => {
  const { currentUser } = useAppContext();
  if (!currentUser) return <Navigate to="/login" replace />;

  const dashboardPaths: { [key in UserRole]?: string } = {
    [UserRole.PRODUCT_SUPPLIER]: "/supplier/dashboard",
    [UserRole.SERVICE_PROVIDER]: "/service-provider/dashboard",
    [UserRole.FOUNDATION]: "/foundation/dashboard",
    [UserRole.EDUCATOR]: "/educator/dashboard",
    [UserRole.PARENT]: "/parent/dashboard",
  };

  if(currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN) {
    // This should ideally not happen in the frontend app. Log them out.
    return <Navigate to="/login" replace />;
  }

  const path = dashboardPaths[currentUser.role];
  return path ? <Navigate to={path} replace /> : <Navigate to="/login" replace />;
};

const ProtectedLayout: React.FC = () => {
  const { currentUser } = useAppContext();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<RoleBasedDashboardRedirect />} />
        
        <Route path="/marketplace/*" element={<MarketplacePage />} />
        <Route path="/recruitment/*" element={<RecruitmentPage />} />
        
        <Route path="/candidate/:candidateId" element={<CandidateProfilePage />} />
        <Route path="/messages/*" element={<MessagesPage />} />

        <Route path="/hr-procedures" element={<ProtectedRoute roles={[UserRole.FOUNDATION]}><HRProceduresPage /></ProtectedRoute>} />
        <Route path="/state-policies" element={<ProtectedRoute roles={[UserRole.FOUNDATION, UserRole.PRODUCT_SUPPLIER, UserRole.EDUCATOR, UserRole.PARENT]}><StatePoliciesPage /></ProtectedRoute>} />
        <Route path="/e-learning" element={<ProtectedRoute roles={[UserRole.FOUNDATION]}><ELearningPage /></ProtectedRoute>} />
        
        <Route path="/partner/:partnerId" element={<PartnerDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        
        {/* Role Specific Routes */}
        <Route path="/supplier/dashboard" element={<ProtectedRoute roles={[UserRole.PRODUCT_SUPPLIER]}><SupplierDashboardPage /></ProtectedRoute>} />
        <Route path="/supplier/orders" element={<ProtectedRoute roles={[UserRole.PRODUCT_SUPPLIER]}><SupplierOrdersPage /></ProtectedRoute>} />
        <Route path="/supplier/product-listings" element={<ProtectedRoute roles={[UserRole.PRODUCT_SUPPLIER]}><SupplierProductListingsPage /></ProtectedRoute>} />
        <Route path="/supplier/analytics" element={<ProtectedRoute roles={[UserRole.PRODUCT_SUPPLIER]}><SupplierAnalyticsPage /></ProtectedRoute>} />
        <Route path="/supplier/support" element={<ProtectedRoute roles={[UserRole.PRODUCT_SUPPLIER]}><SupplierSupportPage /></ProtectedRoute>} />

        <Route path="/service-provider/dashboard" element={<ProtectedRoute roles={[UserRole.SERVICE_PROVIDER]}><ServiceProviderDashboardPage /></ProtectedRoute>} />
        <Route path="/service-provider/requests" element={<ProtectedRoute roles={[UserRole.SERVICE_PROVIDER]}><ServiceProviderRequestsPage /></ProtectedRoute>} />
        <Route path="/service-provider/service-listings" element={<ProtectedRoute roles={[UserRole.SERVICE_PROVIDER]}><ServiceProviderListingsPage /></ProtectedRoute>} />
        <Route path="/service-provider/analytics" element={<ProtectedRoute roles={[UserRole.SERVICE_PROVIDER]}><ServiceProviderAnalyticsPage /></ProtectedRoute>} />
        <Route path="/service-provider/support" element={<ProtectedRoute roles={[UserRole.SERVICE_PROVIDER]}><ServiceProviderSupportPage /></ProtectedRoute>} />
        
        <Route path="/foundation/dashboard" element={<ProtectedRoute roles={[UserRole.FOUNDATION]}><FoundationDashboardPage /></ProtectedRoute>} />
        <Route path="/foundation/orders-appointments" element={<ProtectedRoute roles={[UserRole.FOUNDATION]}><FoundationOrdersAppointmentsPage /></ProtectedRoute>} />
        <Route path="/foundation/leads" element={<ProtectedRoute roles={[UserRole.FOUNDATION]}><FoundationLeadsPage /></ProtectedRoute>} />
        <Route path="/foundation/analytics" element={<ProtectedRoute roles={[UserRole.FOUNDATION]}><FoundationAnalyticsPage /></ProtectedRoute>} />
        <Route path="/foundation/organisation-profile" element={<ProtectedRoute roles={[UserRole.FOUNDATION]}><FoundationOrganisationProfilePage /></ProtectedRoute>} />
        <Route path="/foundation/support" element={<ProtectedRoute roles={[UserRole.FOUNDATION]}><FoundationSupportPage /></ProtectedRoute>} />

        <Route path="/educator/dashboard" element={<ProtectedRoute roles={[UserRole.EDUCATOR]}><EducatorDashboardPage /></ProtectedRoute>} />
        <Route path="/educator/job-board" element={<ProtectedRoute roles={[UserRole.EDUCATOR]}><EducatorJobBoardPage /></ProtectedRoute>} />
        <Route path="/educator/profile" element={<ProtectedRoute roles={[UserRole.EDUCATOR]}><EducatorProfilePage /></ProtectedRoute>} />
        <Route path="/educator/applications" element={<ProtectedRoute roles={[UserRole.EDUCATOR]}><EducatorApplicationsPage /></ProtectedRoute>} />
        <Route path="/educator/support" element={<ProtectedRoute roles={[UserRole.EDUCATOR]}><EducatorSupportPage /></ProtectedRoute>} />

        <Route path="/parent/dashboard" element={<ProtectedRoute roles={[UserRole.PARENT]}><ParentDashboardPage /></ProtectedRoute>} />
        <Route path="/parent/enquiries" element={<ProtectedRoute roles={[UserRole.PARENT]}><ParentEnquiriesPage /></ProtectedRoute>} />
        <Route path="/parent/support" element={<ProtectedRoute roles={[UserRole.PARENT]}><ParentSupportPage /></ProtectedRoute>} />

        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/file-gallery" element={<ProtectedRoute roles={[UserRole.EDUCATOR]}><FileGalleryPage /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  );
};

const App: React.FC = () => {
  return (
    <React.Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Frontend...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/parent-lead-form" element={<ParentLeadFormPage />} />
        
        {/* Protected Routes */}
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </React.Suspense>
  );
};

export default App;
