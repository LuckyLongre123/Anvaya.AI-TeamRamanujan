import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider.jsx';
import NavBar from '../NavBar.jsx';
import Footer from '../Footer.jsx';

export const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <div>
      <NavBar />
      <main style={{ padding: 16 }}>{children}</main>
      <Footer />
    </div>
  );
};

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
};

export default PublicRoute;
