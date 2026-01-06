import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex font-['Inter',sans-serif]">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-gray-50 dark:bg-[#111114]">
        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-3">
              <a href="https://callnfy.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Terms of Service
              </a>
              <span>·</span>
              <a href="https://callnfy.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Privacy Policy
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <a href="https://x.com/callnfy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://linkedin.com/company/callnfy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
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
