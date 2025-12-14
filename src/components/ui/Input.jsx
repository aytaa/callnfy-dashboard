import { clsx } from 'clsx';

/**
 * Input Component
 *
 * Props:
 * @param {string} label - Input label text
 * @param {string} error - Error message to display
 * @param {string} type - Input type (default: 'text')
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} className - Additional CSS classes for input
 * @param {boolean} required - Mark as required
 * @param {boolean} disabled - Disable the input
 */
export default function Input({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  className,
  required = false,
  disabled = false,
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const baseStyles = 'w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';

  const normalStyles = 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500';

  const errorStyles = 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-red-500 focus:border-red-500';

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={clsx(
          baseStyles,
          error ? errorStyles : normalStyles,
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
