import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useGetSubscriptionQuery } from '../slices/apiSlice/billingApiSlice';

/**
 * SubscriptionGuard - Protects routes that require an active subscription
 *
 * Redirects to /plan if:
 * - No subscription exists
 * - Subscription status is not active/trialing
 *
 * Allows access if:
 * - Subscription status is 'active' or 'trialing'
 */
export default function SubscriptionGuard({ children }) {
  const location = useLocation();
  const {
    data: subscription,
    isLoading,
    isFetching,
    isUninitialized,
    refetch,
  } = useGetSubscriptionQuery(undefined, {
    // Refetch on mount to ensure fresh data
    refetchOnMountOrArgChange: true,
  });

  // Refetch subscription data on component mount
  useEffect(() => {
    // Force refetch to get latest subscription status
    refetch();
  }, [refetch]);

  // Show loading state while checking subscription (initial load or refetching)
  if (isLoading || isUninitialized || isFetching) {
    return (
      <div className="min-h-screen bg-[#111114] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if subscription exists and is valid
  // Handle different possible API response structures
  const status = subscription?.status || subscription?.data?.status;
  const hasValidSubscription = status === 'active' || status === 'trialing';

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('[SubscriptionGuard] Subscription data:', subscription);
    console.log('[SubscriptionGuard] Status:', status);
    console.log('[SubscriptionGuard] Has valid subscription:', hasValidSubscription);
  }

  // If no valid subscription, redirect to plan page
  if (!hasValidSubscription) {
    // Store the intended destination so we can redirect after subscribing
    return <Navigate to="/plan" state={{ from: location }} replace />;
  }

  // User has valid subscription, render children
  return children;
}
