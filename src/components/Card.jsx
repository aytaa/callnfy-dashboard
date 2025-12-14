import React from 'react';

export default function Card({ children, className = '', padding = true, ...props }) {
  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-lg ${padding ? 'p-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
