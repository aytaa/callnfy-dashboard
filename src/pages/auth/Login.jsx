import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Phone } from 'lucide-react';
import { useLoginMutation } from '../../slices/apiSlice/authApiSlice';
import { setCredentials, clearForceLogout } from '../../slices/authSlice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login({ email, password }).unwrap();

      // Clear forceLogout flag before setting credentials
      // This allows the user to log back in after being forcefully logged out
      dispatch(clearForceLogout());

      // Tokens are now set as httpOnly cookies by the backend
      // We only store the user info in Redux
      dispatch(setCredentials({
        user: result.data.user,
      }));

      // Redirect to the originally intended page, or default to /overview
      const from = location.state?.from?.pathname || '/overview';
      navigate(from, { replace: true });
    } catch (err) {
      // Provide user-friendly error messages for common auth errors
      if (err?.status === 401 || err?.data?.error?.code === 'INVALID_CREDENTIALS') {
        setError('Invalid email or password. Please try again.');
      } else if (err?.status === 429) {
        setError('Too many login attempts. Please wait a moment and try again.');
      } else {
        setError(err?.data?.error?.message || err?.data?.message || 'Failed to login. Please try again.');
      }
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
          Sign in to your account
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Please enter your details.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {successMessage && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-[#303030] rounded-lg bg-white dark:bg-[#1a1a1d] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-gray-400 dark:focus:border-[#404040] focus:outline-none transition-all text-sm"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-2 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-gray-900 dark:text-white font-semibold hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
