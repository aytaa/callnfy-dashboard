import { clsx } from 'clsx';

/**
 * Toggle Component (Switch)
 *
 * Props:
 * @param {boolean} checked - Toggle state
 * @param {function} onChange - Change handler
 * @param {string} label - Label text
 * @param {boolean} disabled - Disable the toggle
 * @param {string} className - Additional CSS classes
 */
export default function Toggle({
  checked = false,
  onChange,
  label,
  disabled = false,
  className,
  id,
  ...props
}) {
  const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={clsx('flex items-center', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={clsx(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed',
          checked
            ? 'bg-teal-500'
            : 'bg-gray-300 dark:bg-gray-600'
        )}
        {...props}
      >
        <span
          className={clsx(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
      {label && (
        <label
          htmlFor={toggleId}
          className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
    </div>
  );
}
