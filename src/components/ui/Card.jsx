import { clsx } from 'clsx';

/**
 * Card Component
 *
 * Props:
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {boolean} noPadding - Remove default padding
 */
export default function Card({
  children,
  className,
  noPadding = false,
  ...props
}) {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200',
        !noPadding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
