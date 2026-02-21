import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { useAuth } from './providers/AuthProvider.jsx';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 inset-x-0 w-full z-100 bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-900 tracking-tighter leading-none">Anvaya.Ai</span>
              <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">Logic Engine</span>
            </div>
          </Link>

          {/* Navigation & Auth */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-wide"
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
                
                <div className="h-4 w-px bg-slate-200" />
                
                <button 
                  onClick={() => logout()} 
                  className="flex items-center gap-2 pl-2 text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors group"
                >
                  <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="inline-flex items-center px-5 py-2 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-100 transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}