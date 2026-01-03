import { useState } from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetMeQuery } from '../../slices/apiSlice/authApiSlice';
import { useCreateCheckoutMutation } from '../../slices/apiSlice/subscriptionApiSlice';
import { toast } from 'react-hot-toast';

export default function SelectPlan() {
  const { data: userData } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const [createCheckout, { isLoading }] = useCreateCheckoutMutation();

  const user = userData?.data;
  const subscriptionStatus = user?.subscriptionStatus;
  const trialEndsAt = user?.trialEndsAt;

  // Check if trial has expired
  const isTrialExpired = subscriptionStatus === 'trialing' && trialEndsAt && new Date(trialEndsAt) < new Date();
  const isTrialActive = subscriptionStatus === 'trialing' && trialEndsAt && new Date(trialEndsAt) > new Date();

  const features = [
    '1 AI Assistant',
    '100 minutes/month',
    'Unlimited appointments',
    'Email notifications',
  ];

  const handleSubscribe = async () => {
    try {
      const result = await createCheckout({
        planId: 'starter',
        priceId: 'price_1SehRyPxQjc0tIx0A8nPOawQ',
      }).unwrap();

      if (result?.data?.sessionUrl) {
        window.location.href = result.data.sessionUrl;
      } else if (result?.sessionUrl) {
        window.location.href = result.sessionUrl;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error?.data?.message || 'Failed to start checkout');
    }
  };

  return (
    <div className="min-h-screen bg-[#212121] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back to Dashboard link if trial is still active */}
        {isTrialActive && (
          <Link
            to="/overview"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isTrialExpired ? 'Your Trial Has Ended' : 'Upgrade Your Plan'}
          </h1>
          <p className="text-gray-400">
            {isTrialExpired
              ? 'Subscribe now to continue using Callnfy'
              : 'Upgrade to unlock full features'}
          </p>
        </div>

        <div className="bg-[#171717] rounded-lg border border-[#303030] p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Starter Plan</h2>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold text-white">£29</span>
              <span className="text-gray-400">/month</span>
            </div>
            {!isTrialExpired && (
              <p className="text-sm text-gray-500 mt-2">Billed monthly</p>
            )}
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-500" />
                </div>
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Loading...' : isTrialExpired ? 'Subscribe Now' : 'Upgrade Now'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            {isTrialExpired
              ? 'Secure payment powered by Stripe'
              : 'Cancel anytime. No long-term commitment.'}
          </p>
        </div>
      </div>
    </div>
  );
}
