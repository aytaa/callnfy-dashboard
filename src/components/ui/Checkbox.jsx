import { clsx } from 'clsx';

export function Checkbox({
  label,
  error,
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <div className={clsx('w-full', containerClassName)}>
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          className={clsx(
            'w-4 h-4 bg-gray-800 border-gray-700 rounded text-blue-600',
            'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900',
            'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
            className
          )}
          {...props}
        />
        {label && <span className="ml-2 text-sm text-gray-300">{label}</span>}
      </label>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
