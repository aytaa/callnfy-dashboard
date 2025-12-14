import { Link } from 'react-router-dom';

function ForgotPassword() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Forgot Password?
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Enter your email to reset your password
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

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Send Reset Link
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        <Link to="/login" className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
          Back to Login
        </Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
