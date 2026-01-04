import { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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
  } = useGetSubscriptionQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Fetch user - NO automatic refetching
  const {
    data: userData,
    isLoading: isLoadingUser,
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

    // Extract user from various possible response structures
    const user = userData?.data?.user || userData?.data || userData?.user || userData;
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

  // Show loading state
  if (isLoadingSubscription || isLoadingUser) {
    return (
      <div className="min-h-screen bg-[#111114] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
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
    const user = userData?.data?.user || userData?.data || userData?.user || userData;
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
