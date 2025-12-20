import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegisterMutation } from '../../slices/apiSlice/authApiSlice';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();

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

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await register({
        email: formData.email,
        name: formData.name,
        password: formData.password,
      }).unwrap();

      setSuccess(true);
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to create account. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Check your email
          </h1>
          <p className="text-sm text-gray-400">
            We've sent a verification link to
          </p>
          <p className="text-white font-semibold mt-1">
            {formData.email}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Click the link in the email to verify your account and complete registration.
          </p>

          <Link
            to="/login"
            className="inline-block w-full bg-white text-black py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Create your account
        </h1>
        <p className="text-sm text-gray-400">
          Get started with Callnfy today
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
            Full name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-[#303030] rounded-lg bg-[#262626] text-white placeholder-gray-500 focus:border-[#3a3a3a] focus:outline-none transition-all"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-[#303030] rounded-lg bg-[#262626] text-white placeholder-gray-500 focus:border-[#3a3a3a] focus:outline-none transition-all"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-[#303030] rounded-lg bg-[#262626] text-white placeholder-gray-500 focus:border-[#3a3a3a] focus:outline-none transition-all"
            placeholder="••••••••"
            required
            minLength={8}
          />
          <p className="text-xs text-gray-400 mt-1">
            Must be at least 8 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-black py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-white font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
