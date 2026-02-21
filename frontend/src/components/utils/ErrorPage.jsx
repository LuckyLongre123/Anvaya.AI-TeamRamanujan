import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ delay = 1500 }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (window.history.length > 1) {
          navigate(-1, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } catch (e) {
        navigate('/', { replace: true });
      }
    }, delay);

    return () => clearTimeout(t);
  }, [navigate, delay]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl font-bold text-red-500 mb-4">404</div>
        <div className="text-xl font-semibold text-gray-800 mb-2">Page not found</div>
        <div className="text-gray-600 mb-6">Redirecting shortly...</div>
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-red-500 animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
