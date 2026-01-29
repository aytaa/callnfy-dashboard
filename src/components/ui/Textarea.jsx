import { clsx } from 'clsx';

/**
 * Textarea Component
 *
 * Props:
 * @param {string} label - Textarea label text
 * @param {string} error - Error message to display
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Textarea value
 * @param {function} onChange - Change handler
 * @param {string} className - Additional CSS classes for textarea
 * @param {boolean} required - Mark as required
 * @param {boolean} disabled - Disable the textarea
 * @param {number} rows - Number of rows (default: 4)
 */
export default function Textarea({
  label,
  error,
  placeholder,
  value,
  onChange,
  className,
  required = false,
  disabled = false,
  rows = 4,
  id,
  ...props
}) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const baseStyles = 'w-full px-3 py-2 rounded-md border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-y';

  const normalStyles = 'border-gray-200 dark:border-[#303030] bg-white dark:bg-[#111114] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040]';

  const errorStyles = 'border-red-500 bg-red-50 dark:bg-[#111114] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-red-500';

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs text-gray-500 mb-1"
        >
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={clsx(
          baseStyles,
          error ? errorStyles : normalStyles,
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
