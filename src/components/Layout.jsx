import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetMeQuery } from '../slices/apiSlice/authApiSlice';
import Sidebar from './Sidebar';

export default function Layout({ children, skipSubscriptionCheck = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { data: userData, isLoading: isLoadingUser } = useGetMeQuery();

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

  // Check subscription status and redirect if needed
  useEffect(() => {
    if (skipSubscriptionCheck || isLoadingUser) return;

    const user = userData?.data;
    const subscriptionStatus = user?.subscriptionStatus;

    // If no subscription, redirect to select plan
    if (!subscriptionStatus || subscriptionStatus === null || subscriptionStatus === undefined) {
      navigate('/select-plan', { replace: true });
      return;
    }

    // If subscription is canceled or past due, redirect to settings with warning
    if (subscriptionStatus === 'canceled' || subscriptionStatus === 'past_due') {
      navigate('/settings?subscription=warning', { replace: true });
      return;
    }

    // Allow access for trialing or active subscriptions
  }, [userData, isLoadingUser, skipSubscriptionCheck, navigate]);

  // Show loading while checking subscription
  if (!skipSubscriptionCheck && isLoadingUser) {
    return (
      <div className="flex h-screen bg-[#212121] items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#212121]">
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
