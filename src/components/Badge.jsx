import React from 'react';

export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-700 text-gray-300',
    green: 'bg-green-900/30 text-green-400 border border-green-800',
    red: 'bg-red-900/30 text-red-400 border border-red-800',
    yellow: 'bg-yellow-900/30 text-yellow-400 border border-yellow-800',
    blue: 'bg-blue-900/30 text-blue-400 border border-blue-800',
    purple: 'bg-purple-900/30 text-purple-400 border border-purple-800',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
