import React from 'react';

export default function ProgressBar({ current, max, label, showPercentage = true }) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{label}</span>
          {showPercentage && (
            <span className="text-white">
              {current}/{max}
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-[#2a2a2a] rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
