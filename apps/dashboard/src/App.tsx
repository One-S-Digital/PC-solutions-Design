import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from 'packages/contexts/src/AppContext';
import { UserRole } from 'packages/core/src/types';
import { MOCK_SUPER_ADMIN_USER } from 'packages/core/src/constants';
import Button from 'packages/ui/src/components/Button';
import { useTranslation } from 'react-i18next';

// Layout and Pages
import MainLayout from './components/layout/MainLayout';
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const UserListPage = React.lazy(() => import('./pages/UserListPage'));
const AdminSystemMonitoringPage = React.lazy(() => import('./pages/admin/AdminSystemMonitoringPage'));
const AdminPlatformSettingsPage = React.lazy(() => import('./pages/admin/AdminPlatformSettingsPage'));

const AdminLoginPage: React.FC = () => {
    const { t } = useTranslation();
    const { login, currentUser } = useAppContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleAdminLogin = React.useCallback(async () => {
        setIsLoading(true);
        setError('');
        // Simulate logging in as the super admin
        const result = await login(MOCK_SUPER_ADMIN_USER.email); 
        if (!result.success) {
            setError(result.message || 'Auto-login failed.');
        }
        setIsLoading(false);
    }, [login]);

    // Redirect if already logged in
    React.useEffect(() => {
        if (currentUser && (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN)) {
            navigate('/', { replace: true });
        }
    }, [currentUser, navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-surface-0">
            <div className="p-8 bg-surface-1 rounded-lg shadow-soft text-center w-full max-w-sm">
                <div className="flex items-center justify-center brand mb-6">
                    <div className="w-1.5 h-10 bg-accent rounded-full mr-3"></div>
                    <h1 className="text-2xl font-bold text-text-strong">{t('appName')} Admin</h1>
                </div>
                {error && <p className="text-danger text-sm mb-4">{error}</p>}
                <Button onClick={handleAdminLogin} variant="secondary" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login as Super Admin (Demo)"}
                </Button>
            </div>
        </div>
    );
};

// FIX: Changed children type from JSX.Element to React.ReactElement to resolve namespace error
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { currentUser } = useAppContext();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPER_ADMIN) {
    return <Navigate to="/login" replace />; 
  }

  return children;
};

const App: React.FC = () => {
  return (
    <React.Suspense fallback={<div className="flex h-screen items-center justify-center bg-surface-0 text-text-default">Loading Dashboard...</div>}>
        <Routes>
            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="/*" element={
                <ProtectedRoute>
                    <MainLayout>
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/users/*" element={<UserListPage />} />
                            <Route path="/system-monitoring" element={<AdminSystemMonitoringPage />} />
                            <Route path="/platform-settings" element={<AdminPlatformSettingsPage />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </MainLayout>
                </ProtectedRoute>
            }/>
        </Routes>
    </React.Suspense>
  );
};

export default App;
