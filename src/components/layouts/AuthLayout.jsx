function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 dark:from-teal-600 dark:via-emerald-600 dark:to-cyan-600 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-dark-border">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
              Callnfy
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              AI-Powered Calling Platform
            </p>
          </div>

          {/* Content */}
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 mt-6 text-sm">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;
