import React from 'react';

export default function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`w-full bg-[#111114] border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zinc-600 ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#111114] text-white">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
