import { clsx } from 'clsx';

/**
 * Badge Component
 *
 * Props:
 * @param {string} variant - 'success' | 'warning' | 'error' | 'info' (default: 'info')
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {ReactNode} children - Badge content
 * @param {string} className - Additional CSS classes
 */
export default function Badge({
  variant = 'info',
  size = 'md',
  children,
  className,
  ...props
}) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full transition-colors duration-200';

  const variants = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
