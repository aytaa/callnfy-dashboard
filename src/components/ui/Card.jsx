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
        'bg-white dark:bg-[#1a1a1d] rounded-lg border border-gray-200 dark:border-[#303030] transition-colors duration-200',
        !noPadding && 'p-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
