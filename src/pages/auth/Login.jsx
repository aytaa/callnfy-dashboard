import { Link } from 'react-router-dom';

function Login() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Welcome Back
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Sign in to your Callnfy account
      </p>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        Don't have an account?{' '}
        <Link to="/signup" className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;
