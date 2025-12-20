import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Create new password
        </h1>
        <p className="text-sm text-gray-400">
          Enter your new password below
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-[#303030] rounded-lg bg-[#262626] text-white placeholder-gray-500 focus:border-[#3a3a3a] focus:outline-none transition-all"
            placeholder="••••••••"
            required
            minLength={8}
            disabled={!token}
          />
          <p className="text-xs text-gray-400 mt-1">
            Must be at least 8 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-[#303030] rounded-lg bg-[#262626] text-white placeholder-gray-500 focus:border-[#3a3a3a] focus:outline-none transition-all"
            placeholder="••••••••"
            required
            disabled={!token}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !token}
          className="w-full bg-white text-black py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Resetting password...' : 'Reset password'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default ResetPassword;
