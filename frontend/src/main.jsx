import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Project from './pages/Project.jsx';
import { AuthProvider } from './components/providers/AuthProvider.jsx';
import ErrorPage from './components/utils/ErrorPage.jsx';
import { PublicRoute, ProtectedRoute } from './components/providers/AuthRoutes.jsx';
import { Toaster } from 'sonner';
import './main.css';

const router = createBrowserRouter([
  { path: '/', element: <PublicRoute><App /></PublicRoute> },
  { path: '/login', element: <PublicRoute><Login /></PublicRoute> },
  { path: '/signup', element: <PublicRoute><Signup /></PublicRoute> },
  { path: '/dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
  { path: '/project/:id', element: <ProtectedRoute><Project /></ProtectedRoute> },
  { path: '*', element: <ErrorPage /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  </StrictMode>,
);
