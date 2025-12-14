import React from 'react';

export default function ProgressBar({ current, max, label, showPercentage = true }) {
  const percentage = Math.min((current / max) * 100, 100);
  const isNearLimit = percentage > 80;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{label}</span>
          {showPercentage && (
            <span className={isNearLimit ? 'text-yellow-400' : ''}>
              {current}/{max}
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isNearLimit ? 'bg-yellow-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
