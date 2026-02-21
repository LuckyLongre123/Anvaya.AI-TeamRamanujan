import React from 'react';
import UserProfile from '../components/dashboradSubcomponents/UserProfile.jsx';
import ProjectSection from '../components/dashboradSubcomponents/ProjectSection.jsx';
import { useAuth } from '../components/providers/AuthProvider.jsx';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiActivity, FiLayers } from 'react-icons/fi';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
    } finally {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 relative overflow-hidden">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/5 blur-[120px] rounded-full" />

      {/* --- DASHBOARD HEADER --- */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <FiActivity className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Engine Instance: Active</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Anvaya Workspace</h2>
        </div>

        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm active:scale-95"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <FiLogOut size={14} />
          Terminate Session
        </button>
      </div>

      {/* --- MAIN DASHBOARD GRID --- */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-[280px_1fr] gap-8 items-start">
        {/* User Stats/Profile Sidebar */}
        <aside className="sticky top-8 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-4xl border border-slate-200/60 shadow-xl shadow-slate-200/40 p-1 overflow-hidden">
            <UserProfile />
          </div>
         
        </aside>

        {/* Projects Main Section */}
        <main className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 shadow-2xl shadow-slate-200/50 p-8 min-h-[70vh]">
          <ProjectSection />
        </main>
      </div>
    </div>
  );
}