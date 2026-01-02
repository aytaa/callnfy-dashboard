import { Check, Loader2, Phone, Calendar, Users, Clock, MessageSquare, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCreateCheckoutMutation } from '../../slices/apiSlice/billingApiSlice';
import { toast } from 'react-hot-toast';

export default function Plan() {
  const navigate = useNavigate();
  const [createCheckout, { isLoading }] = useCreateCheckoutMutation();

  const getTrialEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const benefits = [
    { icon: Phone, text: '24/7 AI Receptionist' },
    { icon: Users, text: 'Automatic Lead Capture' },
    { icon: Calendar, text: 'Smart Appointment Booking' },
    { icon: MessageSquare, text: 'Call Summaries & Transcripts' },
    { icon: Clock, text: 'After-Hours Call Handling' },
    { icon: Shield, text: 'Never Miss a Call Again' },
  ];

  const handleStartTrial = async () => {
    try {
      const successUrl = `${window.location.origin}/checkout/success`;
      const cancelUrl = `${window.location.origin}/plan`;

      const result = await createCheckout({
        planId: 'pro',
        trial: true,
        successUrl,
        cancelUrl,
      }).unwrap();

      if (result?.url || result?.sessionUrl) {
        window.location.href = result.url || result.sessionUrl;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error?.data?.message || 'Failed to start trial');
    }
  };

  return (
    <div className="min-h-screen bg-[#111114] flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            One Last Step
          </h1>
          <p className="text-gray-400">
            Start your free trial to activate your AI receptionist
          </p>
        </div>

        {/* Plan Card */}
        <div className="bg-[#1a1a1d] border border-[#303030] rounded-xl p-6">
          {/* Plan Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-white">Callnfy Pro</span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                7-day FREE trial
              </span>
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-white">$29</span>
              <span className="text-gray-400">/month</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">after trial ends</p>
          </div>

          {/* Divider */}
          <div className="border-t border-[#303030] my-6"></div>

          {/* Benefits */}
          <div className="space-y-4 mb-6">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">What's included</p>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#111114] flex items-center justify-center">
                  <benefit.icon className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                </div>
                <span className="text-white text-sm">{benefit.text}</span>
                <Check className="w-4 h-4 text-emerald-500 ml-auto" strokeWidth={2} />
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-[#303030] my-6"></div>

          {/* CTA */}
          <button
            onClick={handleStartTrial}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Starting Trial...
              </>
            ) : (
              'Start Free Trial'
            )}
          </button>

          {/* No charge notice */}
          <div className="mt-4 p-3 bg-[#111114] rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              You won't be charged until <span className="text-white font-medium">{getTrialEndDate()}</span>
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              Cancel anytime during your trial
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Secure payment powered by Stripe
        </p>
      </div>
    </div>
  );
}
