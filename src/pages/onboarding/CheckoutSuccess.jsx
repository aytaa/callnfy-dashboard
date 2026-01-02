import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { apiSlice } from '../../slices/apiSlice';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('processing'); // processing, success, redirecting

  useEffect(() => {
    const handleSuccess = async () => {
      // Invalidate all billing-related cache to force refetch
      dispatch(apiSlice.util.invalidateTags(['Billing', 'Subscription']));

      // Short delay to show success state
      setStatus('success');

      // Wait a moment then redirect
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStatus('redirecting');

      // Navigate to dashboard
      navigate('/overview', { replace: true });
    };

    handleSuccess();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen bg-[#111114] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-white mb-2">
              Processing...
            </h1>
            <p className="text-gray-400 text-sm">
              Please wait while we confirm your subscription
            </p>
          </>
        )}

        {(status === 'success' || status === 'redirecting') && (
          <>
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">
              You're all set!
            </h1>
            <p className="text-gray-400 text-sm mb-4">
              Your 7-day free trial has started
            </p>
            {status === 'redirecting' && (
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to dashboard...</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
