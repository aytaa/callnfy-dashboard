import { useState } from 'react';
import { Check } from 'lucide-react';
import { useCreateCheckoutMutation } from '../../slices/apiSlice/subscriptionApiSlice';
import { toast } from 'react-hot-toast';

export default function SelectPlan() {
  const [createCheckout, { isLoading }] = useCreateCheckoutMutation();

  const features = [
    '1 AI Assistant',
    '100 minutes/month',
    'Unlimited appointments',
    'Email notifications',
  ];

  const handleStartTrial = async () => {
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h1>
          <p className="text-gray-400">Start your 7-day free trial today</p>
        </div>

        <div className="bg-[#171717] rounded-lg border border-[#303030] p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Starter Plan</h2>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold text-white">£29</span>
              <span className="text-gray-400">/month</span>
            </div>
            <p className="text-sm text-green-500 mt-2">7-day free trial included</p>
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
            onClick={handleStartTrial}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Loading...' : 'Start 7-day free trial'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Cancel anytime during your trial. No charges until trial ends.
          </p>
        </div>
      </div>
    </div>
  );
}
