import React from 'react';
import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-900 mb-4">403</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-bold"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};
