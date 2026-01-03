import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

/**
 * Select Component
 *
 * Props:
 * @param {string} label - Select label text
 * @param {string} error - Error message to display
 * @param {Array} options - Array of {value, label} objects
 * @param {string} value - Selected value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {string} className - Additional CSS classes for select
 * @param {boolean} required - Mark as required
 * @param {boolean} disabled - Disable the select
 */
export default function Select({
  label,
  error,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  required = false,
  disabled = false,
  id,
  ...props
}) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const baseStyles = 'w-full px-3 py-2 pr-10 rounded-md border appearance-none transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const normalStyles = 'border-[#303030] bg-[#111114] text-white focus:border-[#404040]';

  const errorStyles = 'border-red-500 bg-[#111114] text-white focus:border-red-500';

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs text-gray-500 mb-1"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={clsx(
            baseStyles,
            error ? errorStyles : normalStyles,
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
