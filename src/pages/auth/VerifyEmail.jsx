import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useVerifyEmailMutation, useResendVerificationMutation } from '../../slices/apiSlice/authApiSlice';
import { Loader2 } from 'lucide-react';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setError('Invalid or missing verification token. Please check your email link.');
      return;
    }

    const verifyUserEmail = async () => {
      try {
        await verifyEmail(token).unwrap();
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError(err?.data?.message || 'Failed to verify email. The link may have expired.');
      }
    };

    verifyUserEmail();
  }, [searchParams, verifyEmail]);

  const handleResendSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResendSuccess(false);

    try {
      await resendVerification(email).unwrap();
      setResendSuccess(true);
      setShowResendForm(false);
    } catch (err) {
      setError(err?.data?.message || 'Failed to resend verification email. Please try again.');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-gray-600 dark:text-gray-400 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verifying your email...
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please wait while we verify your email address
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Email verified successfully!
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your email has been verified. You can now sign in to your account.
          </p>
        </div>

        <Link
          to="/login"
          className="inline-block w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-center"
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verification failed
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
        </div>

        {resendSuccess ? (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
            <p className="text-sm text-green-600 dark:text-green-400 text-center">
              Verification email sent! Please check your inbox.
            </p>
          </div>
        ) : null}

        {!showResendForm ? (
          <div className="space-y-3">
            <button
              onClick={() => setShowResendForm(true)}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Resend verification email
            </button>
            <Link
              to="/login"
              className="block text-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <div>
            <form className="space-y-4" onSubmit={handleResendSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent outline-none transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isResending}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? 'Sending...' : 'Send verification email'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowResendForm(false)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default VerifyEmail;
