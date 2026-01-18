import { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useGetSubscriptionQuery } from '../slices/apiSlice/billingApiSlice';
import { useGetMeQuery } from '../slices/apiSlice/authApiSlice';
import OnboardingModal from './OnboardingModal';

/**
 * SubscriptionGuard - Protects routes that require an active subscription and completed onboarding
 */
export default function SubscriptionGuard({ children }) {
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const hasCheckedOnboarding = useRef(false);

  // Fetch subscription - NO automatic refetching
  const {
    data: subscription,
    isLoading: isLoadingSubscription,
    isError: isSubscriptionError,
    error: subscriptionError,
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

  // During loading, render children - each page handles its own loading state
  if (isLoadingSubscription || isLoadingUser) {
    return children;
  }

  // Handle API errors - if /me fails, user session may be invalid
  // 401 errors are handled by customBaseQuery (auto logout)
  // For other errors, we show an error state or redirect to login
  if (isUserError) {
    console.error('[SubscriptionGuard] User API error:', userError);
    // If it's not a 401 (which is handled by customBaseQuery), show error or redirect
    const errorStatus = userError?.status || userError?.originalStatus;
    if (errorStatus === 401 || errorStatus === 403) {
      // Auth errors should redirect to login (customBaseQuery may have already done this)
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
    const errorStatus = subscriptionError?.status || subscriptionError?.originalStatus;
    if (errorStatus === 401 || errorStatus === 403) {
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
