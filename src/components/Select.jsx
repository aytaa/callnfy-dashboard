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
        className={`w-full bg-black border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#3a3a3a] ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
