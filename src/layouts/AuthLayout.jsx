import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex font-['Inter',sans-serif]">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-gray-900">
        {/* Logo */}
        <div className="p-6">
          <Link to="/" className="inline-flex items-center space-x-2 text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Phone className="w-6 h-6" />
            <span className="text-xl font-bold">Callnfy</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 text-center">
          <div className="flex items-center justify-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
            <Link to="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span>&middot;</span>
            <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-950 dark:to-black relative overflow-hidden">
        {/* Animated Background */}
        <AnimatedBackground />

        {/* Content Overlay */}
        <div className="relative z-10 flex items-center justify-center p-8">
          <div className="max-w-md">
            {/* Feature Card - Floating Animation */}
            <motion.div
              className="bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-2xl"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-gray-600">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Never Miss a Call
                  </h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Callnfy's AI receptionist handles appointments, answers questions, and manages your calendar 24/7.
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span className="font-medium">Trusted by businesses worldwide</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <motion.div
                className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-xl font-bold text-white">99%</div>
                <div className="text-xs text-gray-400 mt-0.5">Uptime</div>
              </motion.div>
              <motion.div
                className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-xl font-bold text-white">24/7</div>
                <div className="text-xs text-gray-400 mt-0.5">Available</div>
              </motion.div>
              <motion.div
                className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-xl font-bold text-white">1K+</div>
                <div className="text-xs text-gray-400 mt-0.5">Businesses</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
