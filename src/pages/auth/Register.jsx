import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
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
        <div className="flex items-center justify-center space-x-2 text-gray-900 dark:text-white mb-6">
          <Phone className="w-6 h-6" />
          <span className="text-xl" style={{fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700}}>Callnfy</span>
        </div>
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Check your email
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We've sent a verification link to
          </p>
          <p className="text-gray-900 dark:text-white font-semibold mt-1">
            {formData.email}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click the link in the email to verify your account and complete registration.
          </p>

          <Link
            to="/login"
            className="inline-block w-full bg-gray-900 dark:bg-white text-white dark:text-black py-2 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-center"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-900 dark:text-white mb-4">
          <Phone className="w-6 h-6" />
          <span className="text-xl" style={{fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700}}>Callnfy</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Create your account
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Get started with Callnfy today
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
            Full name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 dark:border-[#303030] rounded-lg bg-white dark:bg-[#1a1a1d] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-gray-400 dark:focus:border-[#404040] focus:outline-none transition-all text-sm"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 dark:border-[#303030] rounded-lg bg-white dark:bg-[#1a1a1d] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-gray-400 dark:focus:border-[#404040] focus:outline-none transition-all text-sm"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 dark:border-[#303030] rounded-lg bg-white dark:bg-[#1a1a1d] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-gray-400 dark:focus:border-[#404040] focus:outline-none transition-all text-sm"
            placeholder="••••••••"
            required
            minLength={8}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Must be at least 8 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-2 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-gray-900 dark:text-white font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
