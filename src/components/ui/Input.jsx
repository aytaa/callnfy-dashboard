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

  const isPickerType = type === 'date' || type === 'time';

  const baseStyles = 'w-full px-3 py-2 rounded-md border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const pickerStyles = isPickerType
    ? ' [&::-webkit-calendar-picker-indicator]:dark:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:hover:opacity-100'
    : '';

  const normalStyles = 'border-gray-200 dark:border-[#303030] bg-white dark:bg-[#111114] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040]';

  const errorStyles = 'border-red-500 bg-red-50 dark:bg-[#111114] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-red-500';

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs text-gray-500 mb-1"
        >
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
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
          baseStyles + pickerStyles,
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
