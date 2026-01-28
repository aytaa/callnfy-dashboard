import { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useGetSubscriptionQuery } from '../slices/apiSlice/billingApiSlice';
import { useGetMeQuery } from '../slices/apiSlice/authApiSlice';
import { getIsRefreshing } from '../slices/customBaseQuery';
import OnboardingModal from './OnboardingModal';

/**
 * SubscriptionGuard - Protects routes that require an active subscription and completed onboarding
 */
export default function SubscriptionGuard({ children }) {
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const hasCheckedOnboarding = useRef(false);
  const [isWaitingForRefresh, setIsWaitingForRefresh] = useState(false);

  // Fetch subscription - NO automatic refetching
  const {
    data: subscription,
    isLoading: isLoadingSubscription,
    isError: isSubscriptionError,
    error: subscriptionError,
    refetch: refetchSubscription,
  } = useGetSubscriptionQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Fetch user - NO automatic refetching
  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isUserError,
    error: userError,
    refetch: refetchUser,
  } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Check onboarding status ONCE when data is available
  useEffect(() => {
    // Skip if already checked or still loading
    if (hasCheckedOnboarding.current || isLoadingUser || !userData) return;

    // Extract user from API response (transformResponse unwraps response.data)
    const user = userData?.user || userData;
    const onboardingCompleted = user?.onboardingCompleted === true;

    // Debug logging
    console.log('[SubscriptionGuard] Raw userData:', userData);
    console.log('[SubscriptionGuard] Extracted user:', user);
    console.log('[SubscriptionGuard] onboardingCompleted:', onboardingCompleted);

    if (!onboardingCompleted) {
      console.log('[SubscriptionGuard] Showing onboarding modal');
      setShowOnboarding(true);
    } else {
      console.log('[SubscriptionGuard] Onboarding already completed, skipping modal');
      setShowOnboarding(false);
    }

    hasCheckedOnboarding.current = true;
  }, [userData, isLoadingUser]);

  // Handle onboarding completion - only refetch here
  const handleOnboardingComplete = async () => {
    console.log('[SubscriptionGuard] handleOnboardingComplete called');
    setShowOnboarding(false);

    // Refetch first, then allow re-check
    try {
      await refetchUser();
      console.log('[SubscriptionGuard] User data refetched');
    } catch (err) {
      console.error('[SubscriptionGuard] Refetch failed:', err);
    }

    // Reset check flag AFTER refetch completes so effect runs with new data
    hasCheckedOnboarding.current = false;
  };

  // Check if we have a 401/403 error while refresh might be in progress
  const userErrorStatus = userError?.status || userError?.originalStatus;
  const subscriptionErrorStatus = subscriptionError?.status || subscriptionError?.originalStatus;
  const hasAuthError = (isUserError && (userErrorStatus === 401 || userErrorStatus === 403)) ||
                       (isSubscriptionError && (subscriptionErrorStatus === 401 || subscriptionErrorStatus === 403));

  // Detect when we need to start waiting for refresh
  useEffect(() => {
    if (hasAuthError && getIsRefreshing() && !isWaitingForRefresh) {
      console.log('[SubscriptionGuard] Auth error detected during refresh, starting to wait');
      setIsWaitingForRefresh(true);
    }
  }, [hasAuthError, isWaitingForRefresh]);

  // Poll for token refresh completion and refetch when done
  useEffect(() => {
    if (!isWaitingForRefresh) return;

    const checkRefreshStatus = () => {
      if (!getIsRefreshing()) {
        console.log('[SubscriptionGuard] Token refresh completed, refetching data');
        setIsWaitingForRefresh(false);
        // Refetch both queries to get fresh data with new token
        refetchUser();
        refetchSubscription();
      }
    };

    // Check immediately
    checkRefreshStatus();

    // Then poll every 100ms until refresh is done
    const interval = setInterval(checkRefreshStatus, 100);

    // Cleanup after 10 seconds max to prevent infinite polling
    const timeout = setTimeout(() => {
      console.log('[SubscriptionGuard] Refresh polling timeout, giving up');
      clearInterval(interval);
      setIsWaitingForRefresh(false);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isWaitingForRefresh, refetchUser, refetchSubscription]);

  // During loading, render children - each page handles its own loading state
  if (isLoadingSubscription || isLoadingUser) {
    return children;
  }

  // Handle API errors - if /me fails, user session may be invalid
  // 401 errors are handled by customBaseQuery (auto logout)
  // For other errors, we show an error state or redirect to login
  if (isUserError) {
    console.error('[SubscriptionGuard] User API error:', userError);
    if (userErrorStatus === 401 || userErrorStatus === 403) {
      // If refresh is in progress or we're waiting for it, show loading
      if (getIsRefreshing() || isWaitingForRefresh) {
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-[#111114] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-gray-400 dark:text-zinc-500 animate-spin" />
          </div>
        );
      }
      // Auth errors should redirect to login (customBaseQuery handles this after refresh fails)
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
    // For other errors (500, network, etc), show a simple error state
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#111114] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Unable to load your account data.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Handle subscription API errors similarly
  if (isSubscriptionError) {
    console.error('[SubscriptionGuard] Subscription API error:', subscriptionError);
    if (subscriptionErrorStatus === 401 || subscriptionErrorStatus === 403) {
      // If refresh is in progress or we're waiting for it, show loading
      if (getIsRefreshing() || isWaitingForRefresh) {
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-[#111114] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-gray-400 dark:text-zinc-500 animate-spin" />
          </div>
        );
      }
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
    // For subscription errors, redirect to plan page (they may not have a subscription)
    return <Navigate to="/plan" state={{ from: location }} replace />;
  }

  // Check if subscription exists and is valid
  const status = subscription?.status || subscription?.data?.status;
  const hasValidSubscription = status === 'active' || status === 'trialing';

  // If no valid subscription, redirect to plan page
  if (!hasValidSubscription) {
    return <Navigate to="/plan" state={{ from: location }} replace />;
  }

  // Show onboarding modal if not completed
  if (showOnboarding) {
    const user = userData?.user || userData;
    console.log('[SubscriptionGuard] Rendering modal with user:', user);
    return (
      <>
        {children}
        <OnboardingModal onComplete={handleOnboardingComplete} initialUserData={user} />
      </>
    );
  }

  // User has valid subscription and completed onboarding
  return children;
}
