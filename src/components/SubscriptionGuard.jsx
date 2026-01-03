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

    const user = userData?.data?.user || userData?.user || userData;
    const onboardingCompleted = user?.onboardingCompleted === true;

    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }

    hasCheckedOnboarding.current = true;
  }, [userData, isLoadingUser]);

  // Handle onboarding completion - only refetch here
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    hasCheckedOnboarding.current = false; // Allow re-check after completion
    refetchUser();
  };

  // Show loading state
  if (isLoadingSubscription || isLoadingUser) {
    return (
      <div className="min-h-screen bg-[#111114] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
          <p className="text-white/40 text-sm">Loading...</p>
        </div>
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
    const user = userData?.data?.user || userData?.user || userData;
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
