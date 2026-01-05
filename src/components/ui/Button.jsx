import { clsx } from 'clsx';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black',
    secondary: 'bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-200 dark:border-white/20',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-white',
    outline: 'border border-gray-200 dark:border-[#303030] text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-[#404040]',
    danger: 'bg-red-50 dark:bg-white/10 border border-red-200 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white hover:border-red-600'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-sm'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
