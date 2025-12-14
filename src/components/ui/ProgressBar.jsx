import { clsx } from 'clsx';

/**
 * ProgressBar Component
 *
 * Props:
 * @param {number} percentage - Progress percentage (0-100)
 * @param {string} label - Optional label text
 * @param {string} variant - 'default' | 'success' | 'warning' | 'error' (default: 'default')
 * @param {string} size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} showPercentage - Show percentage text (default: true)
 * @param {string} className - Additional CSS classes
 */
export default function ProgressBar({
  percentage = 0,
  label,
  variant = 'default',
  size = 'md',
  showPercentage = true,
  className,
  ...props
}) {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  const variants = {
    default: 'bg-teal-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={clsx('w-full', className)} {...props}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {clampedPercentage}%
            </span>
          )}
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
          sizes[size]
        )}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500 ease-out',
            variants[variant]
          )}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
}
