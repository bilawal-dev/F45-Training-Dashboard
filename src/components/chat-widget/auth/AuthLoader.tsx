'use client';

import React from 'react';

export const AuthLoader = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-sm text-gray-500">Authenticating...</p>
    </div>
  );
}; 