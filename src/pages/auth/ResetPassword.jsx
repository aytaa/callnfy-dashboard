import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { useResetPasswordMutation } from '../../slices/apiSlice/authApiSlice';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token. Please request a new password reset link.');
      return;
    }

    try {
      await resetPassword({
        token,
        newPassword: formData.newPassword
      }).unwrap();

      navigate('/login', {
        state: { message: 'Password reset successful! Please sign in with your new password.' }
      });
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to reset password. The link may have expired.');
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-900 dark:text-white mb-4">
          <Phone className="w-6 h-6" />
          <span className="text-xl" style={{fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700}}>Callnfy</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Create new password
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your new password below
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 dark:border-[#303030] rounded-lg bg-white dark:bg-[#1a1a1d] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-gray-400 dark:focus:border-[#404040] focus:outline-none transition-all text-sm"
            placeholder="••••••••"
            required
            minLength={8}
            disabled={!token}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Must be at least 8 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 dark:border-[#303030] rounded-lg bg-white dark:bg-[#1a1a1d] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-gray-400 dark:focus:border-[#404040] focus:outline-none transition-all text-sm"
            placeholder="••••••••"
            required
            disabled={!token}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !token}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-2 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Resetting password...' : 'Reset password'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default ResetPassword;
