import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const MetricsCard = ({ title, value, subtitle, trend }) => {
  const trendIcon = trend > 0 ? ChevronUpIcon : ChevronDownIcon;
  const trendColor = trend > 0 ? 'text-green-500' : 'text-red-500';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <span className={`ml-2 flex items-center text-sm ${trendColor}`}>
            {Math.abs(trend)}%
            {React.createElement(trendIcon, { className: 'w-4 h-4' })}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
      )}
    </div>
  );
};

export default MetricsCard;