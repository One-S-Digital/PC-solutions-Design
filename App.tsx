
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage'; // This will be the Foundation default dashboard
import MarketplacePage from './pages/MarketplacePage';
import RecruitmentPage from './pages/RecruitmentPage';
import HRProceduresPage from './pages/HRProceduresPage';
import StatePoliciesPage from './pages/StatePoliciesPage';
import ELearningPage from './pages/ELearningPage';
import PartnersPage from './pages/PartnersPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import { AppContextProvider, useAppContext } from './contexts/AppContext';
import { CartProvider } from './contexts/CartContext';
import { MessagingProvider } from './contexts/MessagingContext';
import { NotificationProvider } from './contexts/NotificationContext'; 
import { UserRole } from './types';

// New Pages
import LoginPage from './pages/LoginPage'; // New Login Page
import SignupPage from './pages/SignupPage'; // New Signup Page Placeholder
import ParentLeadFormPage from './pages/ParentLeadFormPage';
import ParentEnquiriesPage from './pages/ParentEnquiriesPage';
import FoundationLeadsPage from './pages/FoundationLeadsPage';
import ContentManagementDashboardPage from './pages/admin/ContentManagementDashboardPage'; 
import DashboardDetailPage from './pages/DashboardDetailPage'; 
import PartnerDetailPage from './pages/partner/PartnerDetailPage'; 
import CandidateProfilePage from './pages/candidate/CandidateProfilePage';
import MessagesPage from './pages/MessagesPage'; 


// Product Supplier Pages
import SupplierDashboardPage from './pages/supplier/SupplierDashboardPage';
import SupplierOrdersPage from './pages/supplier/SupplierOrdersPage';
import SupplierProductListingsPage from './pages/supplier/SupplierProductListingsPage';
import SupplierAnalyticsPage from './pages/supplier/SupplierAnalyticsPage';
import SupplierCompanyProfilePage from './pages/supplier/SupplierCompanyProfilePage';
import SupplierSupportPage from './pages/supplier/SupplierSupportPage';

// Service Provider Pages
import ServiceProviderDashboardPage from './pages/service-provider/ServiceProviderDashboardPage';
import ServiceProviderRequestsPage from './pages/service-provider/ServiceProviderRequestsPage';
import ServiceProviderListingsPage from './pages/service-provider/ServiceProviderListingsPage';
import ServiceProviderAnalyticsPage from './pages/service-provider/ServiceProviderAnalyticsPage';
import ServiceProviderCompanyProfilePage from './pages/service-provider/ServiceProviderCompanyProfilePage';
import ServiceProviderSupportPage from './pages/service-provider/ServiceProviderSupportPage';

// Foundation Pages (some may reuse existing top-level pages)
import FoundationDashboardPage from './pages/foundation/FoundationDashboardPage';
import FoundationOrdersAppointmentsPage from './pages/foundation/FoundationOrdersAppointmentsPage';
import FoundationAnalyticsPage from './pages/foundation/FoundationAnalyticsPage';
import FoundationOrganisationProfilePage from './pages/foundation/FoundationOrganisationProfilePage';
import FoundationSupportPage from './pages/foundation/FoundationSupportPage';

// Educator Pages
import EducatorDashboardPage from './pages/educator/EducatorDashboardPage';
import EducatorJobBoardPage from './pages/educator/EducatorJobBoardPage';
import EducatorProfilePage from './pages/educator/EducatorProfilePage';
import EducatorApplicationsPage from './pages/educator/EducatorApplicationsPage';
import EducatorSupportPage from './pages/educator/EducatorSupportPage';

// Parent Pages
import ParentSupportPage from './pages/parent/ParentSupportPage';


const ProtectedRoute: React.FC<{ children: JSX.Element; roles: UserRole[] }> = ({ children, roles }) => {
  const { currentUser } = useAppContext();
  if (!currentUser) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }
  if (!roles.includes(currentUser.role)) {
    return <Navigate to="/login" replace />; // Or an unauthorized page
  }
  return children;
};

const RoleBasedDashboardRedirect: React.FC = () => {
  const { currentUser } = useAppContext();
  if (!currentUser) return <Navigate to="/login" replace />; // Default to login for non-logged-in

  switch (currentUser.role) {
    case UserRole.PRODUCT_SUPPLIER:
      return <Navigate to="/supplier/dashboard" replace />;
    case UserRole.SERVICE_PROVIDER:
      return <Navigate to="/service-provider/dashboard" replace />;
    case UserRole.FOUNDATION:
      return <Navigate to="/foundation/dashboard" replace />;
    case UserRole.EDUCATOR:
      return <Navigate to="/educator/dashboard" replace />;
    case UserRole.PARENT:
      return <Navigate to="/parent-lead-form" replace />; 
    case UserRole.ADMIN:
    case UserRole.SUPER_ADMIN:
      return <DashboardPage />; 
    default:
      return <Navigate to="/login" replace />; // Fallback to login
  }
};


const App: React.FC = () => {
  return (
    <AppContextProvider>
      <CartProvider>
        <MessagingProvider>
          <NotificationProvider> 
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              {/* ParentLeadFormPage is accessible to unauthenticated users directly */}
              {/* It's also within MainLayout if a Parent is logged in */}
              
              <Route path="/*" element={
                <MainLayout>
                  <Routes>
                    <Route path="/parent-lead-form" element={<ParentLeadFormPage />} />
                    
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<RoleBasedDashboardRedirect />} />
                    <Route path="/dashboard/details/:detailType" element={<DashboardDetailPage />} />
                    
                    <Route path="/marketplace" element={<Navigate to="/marketplace/products" replace />} />
                    <Route path="/marketplace/products" element={<MarketplacePage />} />
                    <Route path="/marketplace/services" element={<MarketplacePage />} />
                    
                    <Route path="/recruitment" element={<Navigate to="/recruitment/job-listings" replace />} />
                    <Route path="/recruitment/job-listings" element={<RecruitmentPage />} />
                    <Route path="/recruitment/candidate-pool" element={<RecruitmentPage />} />
                    <Route path="/candidate/:candidateId" element={
                      <ProtectedRoute roles={[UserRole.FOUNDATION, UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                        <CandidateProfilePage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/messages" element={
                      <ProtectedRoute roles={[UserRole.FOUNDATION, UserRole.EDUCATOR, UserRole.PRODUCT_SUPPLIER, UserRole.SERVICE_PROVIDER, UserRole.PARENT, UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                        <MessagesPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/messages/:conversationId" element={
                       <ProtectedRoute roles={[UserRole.FOUNDATION, UserRole.EDUCATOR, UserRole.PRODUCT_SUPPLIER, UserRole.SERVICE_PROVIDER, UserRole.PARENT, UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                        <MessagesPage />
                      </ProtectedRoute>
                    } />

                    <Route path="/hr-procedures" element={<ProtectedRoute roles={[UserRole.FOUNDATION, UserRole.ADMIN, UserRole.SUPER_ADMIN]}><HRProceduresPage /></ProtectedRoute>} />
                    <Route path="/state-policies" element={<ProtectedRoute roles={[UserRole.FOUNDATION, UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PRODUCT_SUPPLIER, UserRole.EDUCATOR, UserRole.PARENT]}><StatePoliciesPage /></ProtectedRoute>} />
                    <Route path="/e-learning" element={<ProtectedRoute roles={[UserRole.FOUNDATION, UserRole.EDUCATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PARENT]}><ELearningPage /></ProtectedRoute>} />
                    <Route path="/partners" element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}><PartnersPage /></ProtectedRoute>} />
                    <Route path="/partner/:partnerId" element={ 
                        <ProtectedRoute roles={[UserRole.FOUNDATION, UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PRODUCT_SUPPLIER, UserRole.SERVICE_PROVIDER]}>
                          <PartnerDetailPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/users/*" element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}><UsersPage /></ProtectedRoute>} />
                    <Route path="/settings/*" element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FOUNDATION, UserRole.PARENT, UserRole.EDUCATOR, UserRole.PRODUCT_SUPPLIER, UserRole.SERVICE_PROVIDER]}><SettingsPage /></ProtectedRoute>} />
                    
                    {/* Admin Specific */}
                    <Route 
                      path="/admin/content-dashboard" 
                      element={
                        <ProtectedRoute roles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                          <ContentManagementDashboardPage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Product Supplier Routes */}
                    <Route path="/supplier/dashboard" element={
                      <ProtectedRoute roles={[UserRole.PRODUCT_SUPPLIER]}><SupplierDashboardPage /></ProtectedRoute>
                    } />
                    <Route path="/supplier/orders" element={
                      <ProtectedRoute roles={[UserRole.PRODUCT_SUPPLIER]}><SupplierOrdersPage /></ProtectedRoute>
                    } />
                    <Route path="/supplier/product-listings" element={
                      <ProtectedRoute roles={[UserRole.PRODUCT_SUPPLIER]}><SupplierProductListingsPage /></ProtectedRoute>
                    } />
                    <Route path="/supplier/analytics" element={
                      <ProtectedRoute roles={[UserRole.PRODUCT_SUPPLIER]}><SupplierAnalyticsPage /></ProtectedRoute>
                    } />
                    <Route path="/supplier/company-profile" element={ // This route is effectively replaced by /settings
                      <ProtectedRoute roles={[UserRole.PRODUCT_SUPPLIER]}><Navigate to="/settings" replace /></ProtectedRoute>
                    } />
                    <Route path="/supplier/support" element={
                      <ProtectedRoute roles={[UserRole.PRODUCT_SUPPLIER]}><SupplierSupportPage /></ProtectedRoute>
                    } />

                    {/* Service Provider Routes */}
                    <Route path="/service-provider/dashboard" element={
                      <ProtectedRoute roles={[UserRole.SERVICE_PROVIDER]}><ServiceProviderDashboardPage /></ProtectedRoute>
                    } />
                    <Route path="/service-provider/requests" element={
                      <ProtectedRoute roles={[UserRole.SERVICE_PROVIDER]}><ServiceProviderRequestsPage /></ProtectedRoute>
                    } />
                    <Route path="/service-provider/service-listings" element={
                      <ProtectedRoute roles={[UserRole.SERVICE_PROVIDER]}><ServiceProviderListingsPage /></ProtectedRoute>
                    } />
                    <Route path="/service-provider/analytics" element={
                      <ProtectedRoute roles={[UserRole.SERVICE_PROVIDER]}><ServiceProviderAnalyticsPage /></ProtectedRoute>
                    } />
                     <Route path="/service-provider/company-profile" element={ // This route is effectively replaced by /settings
                      <ProtectedRoute roles={[UserRole.SERVICE_PROVIDER]}><Navigate to="/settings" replace /></ProtectedRoute>
                    } />
                    <Route path="/service-provider/support" element={
                      <ProtectedRoute roles={[UserRole.SERVICE_PROVIDER]}><ServiceProviderSupportPage /></ProtectedRoute>
                    } />
                    
                    {/* Foundation Routes */}
                    <Route path="/foundation/dashboard" element={
                      <ProtectedRoute roles={[UserRole.FOUNDATION]}><FoundationDashboardPage /></ProtectedRoute>
                    } />
                    <Route path="/foundation/orders-appointments" element={
                      <ProtectedRoute roles={[UserRole.FOUNDATION]}><FoundationOrdersAppointmentsPage /></ProtectedRoute>
                    } />
                    <Route path="/foundation/leads" element={ 
                      <ProtectedRoute roles={[UserRole.FOUNDATION]}><FoundationLeadsPage /></ProtectedRoute>
                    } />
                    <Route path="/foundation/analytics" element={
                      <ProtectedRoute roles={[UserRole.FOUNDATION]}><FoundationAnalyticsPage /></ProtectedRoute>
                    } />
                     <Route path="/foundation/organisation-profile" element={ 
                      <ProtectedRoute roles={[UserRole.FOUNDATION]}><FoundationOrganisationProfilePage /></ProtectedRoute>
                    } />
                    <Route path="/foundation/support" element={
                      <ProtectedRoute roles={[UserRole.FOUNDATION]}><FoundationSupportPage /></ProtectedRoute>
                    } />

                    {/* Educator Routes */}
                    <Route path="/educator/dashboard" element={
                      <ProtectedRoute roles={[UserRole.EDUCATOR]}><EducatorDashboardPage /></ProtectedRoute>
                    } />
                    <Route path="/educator/job-board" element={ 
                      <ProtectedRoute roles={[UserRole.EDUCATOR]}><EducatorJobBoardPage /></ProtectedRoute>
                    } />
                    <Route path="/educator/profile" element={
                      <ProtectedRoute roles={[UserRole.EDUCATOR]}><EducatorProfilePage /></ProtectedRoute>
                    } />
                    <Route path="/educator/applications" element={
                      <ProtectedRoute roles={[UserRole.EDUCATOR]}><EducatorApplicationsPage /></ProtectedRoute>
                    } />
                    <Route path="/educator/support" element={
                      <ProtectedRoute roles={[UserRole.EDUCATOR]}><EducatorSupportPage /></ProtectedRoute>
                    } />

                    {/* Parent Routes (other than lead form which can be public) */}
                     <Route path="/parent/enquiries" element={ 
                      <ProtectedRoute roles={[UserRole.PARENT]}><ParentEnquiriesPage /></ProtectedRoute>
                    } />
                    <Route path="/parent/support" element={
                      <ProtectedRoute roles={[UserRole.PARENT]}><ParentSupportPage /></ProtectedRoute>
                    } />
                    
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              } />
            </Routes>
          </NotificationProvider>
        </MessagingProvider>
      </CartProvider>
    </AppContextProvider>
  );
};

export default App;
