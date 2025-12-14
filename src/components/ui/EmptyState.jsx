import { clsx } from 'clsx';
import { Inbox } from 'lucide-react';
import Button from './Button';

/**
 * EmptyState Component
 *
 * Props:
 * @param {ReactNode} icon - Icon component (default: Inbox)
 * @param {string} title - Main message title
 * @param {string} message - Description message
 * @param {string} actionLabel - Button label
 * @param {function} onAction - Button click handler
 * @param {string} className - Additional CSS classes
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data available',
  message = 'Get started by creating a new item',
  actionLabel,
  onAction,
  className,
  ...props
}) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
      {...props}
    >
      <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
        <Icon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
