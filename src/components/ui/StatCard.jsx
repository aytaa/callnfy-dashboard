import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from './Card';

/**
 * StatCard Component
 *
 * Props:
 * @param {ReactNode} icon - Icon component
 * @param {string|number} value - Main statistic value
 * @param {string} label - Description label
 * @param {number} change - Percentage change (positive or negative)
 * @param {string} className - Additional CSS classes
 */
export default function StatCard({
  icon: Icon,
  value,
  label,
  change,
  className,
  ...props
}) {
  const isPositive = change >= 0;

  return (
    <Card className={clsx('hover:shadow-md transition-shadow duration-200', className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {Icon && (
              <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
            )}
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {label}
          </p>
        </div>
        {change !== undefined && (
          <div
            className={clsx(
              'flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium',
              isPositive
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </Card>
  );
}
