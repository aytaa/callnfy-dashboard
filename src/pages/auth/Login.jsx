import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github } from 'lucide-react';
import { motion } from 'framer-motion';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login clicked');

    // Create mock user object
    const mockUser = {
      email: email || 'user@example.com',
      name: 'Demo User',
      id: 'user_' + Date.now(),
      isAuthenticated: true
    };

    // Store in localStorage - IMPORTANT: set callnfy_auth_token for ProtectedRoute
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('callnfy_auth_token', 'mock_token_' + Date.now());

    console.log('Navigating to dashboard...');
    // Redirect to dashboard
    navigate('/dashboard');
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`);

    // Mock social login
    const mockUser = {
      email: `user@${provider}.com`,
      name: 'Demo User',
      id: 'user_' + Date.now(),
      isAuthenticated: true
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('callnfy_auth_token', 'mock_token_' + Date.now());

    navigate('/dashboard');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Sign into your account
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your AI receptionist from one dashboard
        </p>
      </motion.div>

      {/* Social Login Buttons */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2 mb-5">
        <motion.button
          type="button"
          onClick={() => handleSocialLogin('google')}
          className="flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </motion.button>
        <motion.button
          type="button"
          onClick={() => handleSocialLogin('github')}
          className="flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Github className="w-4 h-4 mr-2" />
          GitHub
        </motion.button>
      </motion.div>

      {/* Divider */}
      <motion.div variants={itemVariants} className="relative mb-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
            OR SIGN IN WITH
          </span>
        </div>
      </motion.div>

      {/* Email/Password Form */}
      <form className="space-y-3" onSubmit={handleSubmit}>
        <motion.div variants={itemVariants}>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-transparent outline-none transition-all text-sm"
            placeholder="you@example.com"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-transparent outline-none transition-all text-sm"
            placeholder="••••••••"
          />
        </motion.div>

        <motion.button
          variants={itemVariants}
          type="submit"
          className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm mt-4"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          Sign In
        </motion.button>
      </form>

      {/* Links */}
      <motion.div variants={itemVariants} className="mt-5 space-y-2 text-center text-xs">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-gray-900 dark:text-white font-semibold hover:underline">
            Sign up
          </Link>
        </p>
        <p>
          <Link to="/forgot-password" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Forgot your password?
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default Login;
