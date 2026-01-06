import { useState, useEffect } from 'react';
import { Menu, Loader2 } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetMeQuery, useLogoutMutation } from '../slices/apiSlice/authApiSlice';
import { useGetBusinessesQuery } from '../slices/apiSlice/businessApiSlice';
import { useGetPhoneNumberQuery } from '../slices/apiSlice/phoneApiSlice';
import Sidebar from './Sidebar';
import CreateBusinessModal from './CreateBusinessModal';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ui/ThemeToggle';

export default function Layout({ children, skipSubscriptionCheck = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { data: userData, isLoading: isLoadingUser, error: meError, refetch: refetchUser } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: businesses, isLoading: businessesLoading } = useGetBusinessesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Refetch user data on route change
  useEffect(() => {
    refetchUser();
  }, [location.pathname, refetchUser]);
  const [logout] = useLogoutMutation();

  // Extract phone number ID from route if on phone number detail page
  const phoneNumberIdMatch = location.pathname.match(/^\/phone-numbers\/([^/]+)$/);
  const phoneNumberId = phoneNumberIdMatch ? phoneNumberIdMatch[1] : null;

  // Fetch phone number data if on phone number detail page
  const { data: phoneNumberData } = useGetPhoneNumberQuery(phoneNumberId, {
    skip: !phoneNumberId,
  });

  // Format phone number for display
  const formatPhoneNumber = (number) => {
    if (!number) return '';
    // Remove any non-digit characters
    const cleaned = number.replace(/\D/g, '');
    // Format as +1 (XXX) XXX-XXXX
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return number;
  };

  // Get page title from route
  const getPageTitle = () => {
    const path = location.pathname;

    // Handle phone number detail page
    if (phoneNumberId && phoneNumberData?.data?.phoneNumber) {
      const phoneNumber = phoneNumberData.data.phoneNumber;
      return {
        title: formatPhoneNumber(phoneNumber.phoneNumber || phoneNumber.number),
        subtitle: phoneNumber.name || 'Phone Number',
      };
    }

    if (path === '/overview') return { title: 'Overview' };
    if (path === '/calls') return { title: 'Calls' };
    if (path === '/customers') return { title: 'Customers' };
    if (path === '/appointments') return { title: 'Appointments' };
    if (path === '/phone-numbers') return { title: 'Phone Numbers' };
    if (path === '/ai-assistant') return { title: 'AI Assistant' };
    if (path === '/notifications') return { title: 'Notifications' };
    if (path.startsWith('/settings')) return { title: 'Settings' };
    return { title: 'Dashboard' };
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
      <div className="flex h-screen bg-gray-50 dark:bg-[#111114] items-center justify-center">
        <Loader2 className="w-6 h-6 text-gray-500 dark:text-gray-400 animate-spin" />
      </div>
    );
  }

  // Check if user has no business (after loading is complete)
  const hasBusiness = businesses && businesses.length > 0;
  const showCreateBusinessModal = !businessesLoading && !hasBusiness;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#111114]">
      {/* Show Create Business Modal if no business exists */}
      {showCreateBusinessModal && <CreateBusinessModal />}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`flex-1 flex flex-col bg-gray-50 dark:bg-[#111114] transition-all duration-300 ${isCollapsed ? 'lg:pl-16' : 'lg:pl-60'}`}>
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-[#111114] border-b border-gray-200 dark:border-[#303030] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{getPageTitle().title}</h1>
                {getPageTitle().subtitle && (
                  <p className="text-xs text-gray-500 dark:text-zinc-400">{getPageTitle().subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <NotificationBell />
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between bg-white dark:bg-[#111114] border-b border-gray-200 dark:border-[#303030] px-8 py-2">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{getPageTitle().title}</h1>
            {getPageTitle().subtitle && (
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">{getPageTitle().subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto pt-20 lg:pt-0 bg-gray-50 dark:bg-[#111114]">
          {children}
        </main>
      </div>
    </div>
  );
}
