import React from 'react';

const Loader = ({ message = 'Connecting to server...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-blue-500 animate-spin" />
        <div className="text-gray-700 text-lg font-medium">{message}</div>
      </div>
    </div>
  );
};

export default Loader;
