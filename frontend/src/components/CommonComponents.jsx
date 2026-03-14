import React from 'react';
import { Link } from 'react-router-dom';

export const QuickActionCard = ({ icon, title, description, href }) => {
  return (
    <Link to={href} className="block">
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
};

export const InfoBox = ({ type = 'info', title, children }) => {
  const bgColor = type === 'success' ? 'bg-green-50' : type === 'error' ? 'bg-red-50' : 'bg-blue-50';
  const textColor = type === 'success' ? 'text-green-800' : type === 'error' ? 'text-red-800' : 'text-blue-800';
  const borderColor = type === 'success' ? 'border-green-300' : type === 'error' ? 'border-red-300' : 'border-blue-300';

  return (
    <div className={`${bgColor} border-l-4 ${borderColor} p-4 mb-4`}>
      {title && <p className={`font-bold ${textColor}`}>{title}</p>}
      <div className={`text-sm ${textColor}`}>{children}</div>
    </div>
  );
};

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
    </div>
  );
};

export const EmptyState = ({ icon = '📭', title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action && action}
    </div>
  );
};
