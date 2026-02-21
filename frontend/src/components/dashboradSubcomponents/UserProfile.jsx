import React from 'react';
import { useAuth } from '../../components/providers/AuthProvider.jsx';
import { FiUser, FiMail, FiShield, FiCpu, FiBookmark } from 'react-icons/fi';

export default function UserProfile() {
  const { user } = useAuth();

  return (
    <aside className="relative overflow-hidden flex flex-col gap-6 p-6 rounded-4xl bg-white/40 backdrop-blur-md border border-slate-200/50 shadow-sm transition-all hover:shadow-md">
      
      {/* Avatar Section: Professional "Node" Look */}
      <div className="relative self-center">
        <div className="w-24 h-24 rounded-4xl flex items-center justify-center bg-white border-4 border-indigo-50 shadow-xl shadow-indigo-100/50 text-indigo-600 overflow-hidden">
          {(user?.fullName && user.fullName[0]) ? (
            <span className="text-3xl font-black tracking-tighter uppercase">{user.fullName[0]}</span>
          ) : (
            <FiUser size={32} className="text-slate-300" />
          )}
        </div>
        {/* Verification Badge */}
        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-white shadow-sm">
          <FiShield size={12} strokeWidth={3} />
        </div>
      </div>

      {/* Identity Data */}
      <div className="flex flex-col gap-5">
        
        {/* Full Name & Verification Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-600 mb-1">
            <FiCpu className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Verified Identity</span>
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">
            {user?.fullName ?? 'Guest User'}
          </h3>
          <p className="text-[11px] font-mono text-slate-400 font-medium">
            {user?.email ?? 'no-email@example.com'}
          </p>
        </div>

        <div className="h-px bg-slate-100/80 w-full" />

        {/* Role & Manifesto (Description) */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FiBookmark className="w-3 h-3" /> System Role
            </label>
            <div className="inline-flex px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 text-xs font-bold uppercase tracking-wide">
              {user?.role ?? 'Ramanujan Software Dev'}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic Manifesto</label>
            <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
              "{user?.desc ?? 'No deterministic profile description provided.'}"
            </p>
          </div>
        </div>
      </div>

      {/* Blueprint Texture Background (Subtle) */}
      <div className="absolute inset-0 -z-10 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }} />
    </aside>
  );
}