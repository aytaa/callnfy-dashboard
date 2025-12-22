import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetMeQuery, useLogoutMutation } from '../slices/apiSlice/authApiSlice';
import { useGetBusinessesQuery } from '../slices/apiSlice/businessApiSlice';
import Sidebar from './Sidebar';
import CreateBusinessModal from './CreateBusinessModal';

export default function Layout({ children, skipSubscriptionCheck = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { data: userData, isLoading: isLoadingUser, error: meError, refetch } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: businesses, isLoading: businessesLoading } = useGetBusinessesQuery();
  const [logout] = useLogoutMutation();

  // Get page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/overview') return 'Overview';
    if (path === '/calls') return 'Calls';
    if (path === '/customers') return 'Customers';
    if (path === '/appointments') return 'Appointments';
    if (path === '/phone-numbers') return 'Phone Numbers';
    if (path === '/ai-assistant') return 'AI Assistant';
    if (path.startsWith('/settings')) return 'Settings';
    return 'Dashboard';
  };

  // Listen for sidebar collapse changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('sidebarCollapsed');
      setIsCollapsed(saved === 'true');
    };

    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Also check on interval for same-tab changes (since storage event doesn't fire in same tab)
    const interval = setInterval(handleStorageChange, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Refetch user data on route change
  useEffect(() => {
    refetch();
  }, [location.pathname, refetch]);

  // Handle authentication errors
  useEffect(() => {
    if (meError) {
      // Check if it's a 401 Unauthorized error
      if (meError.status === 401 || meError.status === 'FETCH_ERROR') {
        // Logout and redirect to login
        logout();
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login', { replace: true });
      }
    }
  }, [meError, logout, navigate]);

  // Check subscription status and redirect if needed
  useEffect(() => {
    if (skipSubscriptionCheck || isLoadingUser) return;

    const user = userData?.data;
    const subscriptionStatus = user?.subscriptionStatus;
    const trialEndsAt = user?.trialEndsAt;

    // Allow access for active subscriptions
    if (subscriptionStatus === 'active') {
      return;
    }

    // Check if trial is still valid
    if (subscriptionStatus === 'trialing') {
      if (trialEndsAt) {
        const trialEndDate = new Date(trialEndsAt);
        const now = new Date();

        if (trialEndDate > now) {
          // Trial is still active, allow access
          return;
        } else {
          // Trial expired, redirect to select plan
          navigate('/select-plan', { replace: true });
          return;
        }
      }
      // If trialing but no trialEndsAt, allow access (backend will set it)
      return;
    }

    // If subscription is canceled or past due, redirect to select plan
    if (subscriptionStatus === 'canceled' || subscriptionStatus === 'past_due') {
      navigate('/select-plan', { replace: true });
      return;
    }

    // If no subscription status (null/undefined), allow access
    // Backend will auto-start trial on first login
    // This allows new users to access the dashboard immediately
  }, [userData, isLoadingUser, skipSubscriptionCheck, navigate]);

  // Show loading while checking subscription and businesses
  if (!skipSubscriptionCheck && (isLoadingUser || businessesLoading)) {
    return (
      <div className="flex h-screen bg-[#212121] items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Check if user has no business (after loading is complete)
  const hasBusiness = businesses && businesses.length > 0;
  const showCreateBusinessModal = !businessesLoading && !hasBusiness;

  return (
    <div className="flex h-screen bg-[#212121]">
      {/* Show Create Business Modal if no business exists */}
      {showCreateBusinessModal && <CreateBusinessModal />}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'lg:pl-16' : 'lg:pl-60'}`}>
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#212121] border-b border-[#303030] p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-white">{getPageTitle()}</h1>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-[#212121] border-b border-[#303030] px-8 py-4">
          <h1 className="text-2xl font-semibold text-white">{getPageTitle()}</h1>
        </div>

        <main className="flex-1 overflow-y-auto pt-20 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
