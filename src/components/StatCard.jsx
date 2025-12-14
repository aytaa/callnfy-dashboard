import React from 'react';
import Card from './Card';

export default function StatCard({ title, value, change, icon: Icon, trend = 'up' }) {
  const trendColor = trend === 'up' ? 'text-green-400' : 'text-red-400';

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${trendColor}`}>
              {trend === 'up' ? '↑' : '↓'} {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="bg-gray-800 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-blue-400" />
          </div>
        )}
      </div>
    </Card>
  );
}
