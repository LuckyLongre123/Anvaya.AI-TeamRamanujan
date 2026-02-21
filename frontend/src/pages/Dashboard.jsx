import React from 'react';
import UserProfile from '../components/dashboradSubcomponents/UserProfile.jsx';
import ProjectSection from '../components/dashboradSubcomponents/ProjectSection.jsx';
import { useAuth } from '../components/providers/AuthProvider.jsx';
import { useNavigate } from 'react-router-dom';
import {
  FiLogOut, FiActivity, FiLayers, FiBriefcase, FiCheckCircle,
  FiZap, FiShield, FiFileText, FiClock, FiTrendingUp, FiTrendingDown
} from 'react-icons/fi';

// ── Hardcoded overall project statistics ──
const STATS = [
  {
    label: 'Total Projects',
    value: 24,
    icon: FiBriefcase,
    color: 'indigo',
    trend: '+3 this month',
    trendUp: true,
  },
  {
    label: 'Completed BRDs',
    value: 18,
    icon: FiCheckCircle,
    color: 'emerald',
    trend: '75% completion',
    trendUp: true,
  },
  {
    label: 'Active Pipelines',
    value: 6,
    icon: FiZap,
    color: 'amber',
    trend: '2 near finish',
    trendUp: true,
  },
  {
    label: 'Conflicts Resolved',
    value: 142,
    icon: FiShield,
    color: 'rose',
    trend: '96% auto-resolved',
    trendUp: true,
  },
  {
    label: 'Docs Processed',
    value: 389,
    icon: FiFileText,
    color: 'sky',
    trend: '+47 this week',
    trendUp: true,
  },
  {
    label: 'Avg Completion',
    value: '2.4d',
    icon: FiClock,
    color: 'violet',
    trend: '−0.3d vs last month',
    trendUp: false,
  },
];

// Color mapping for stat cards
const COLOR_MAP = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', iconBg: 'bg-indigo-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', iconBg: 'bg-emerald-100' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', iconBg: 'bg-amber-100' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', iconBg: 'bg-rose-100' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100', iconBg: 'bg-sky-100' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', iconBg: 'bg-violet-100' },
};

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

      {/* ═══════════════════════════════════════════════════════════════
          OVERALL STATISTICS — hardcoded project KPI cards
         ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center gap-2 text-slate-500 mb-4">
          <FiLayers className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operations Overview</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((stat) => {
            const c = COLOR_MAP[stat.color];
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`group relative ${c.bg} ${c.border} border rounded-2xl p-4 transition-all hover:shadow-lg hover:scale-[1.03] cursor-default`}
              >
                {/* Icon badge */}
                <div className={`${c.iconBg} ${c.text} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Value */}
                <p className={`text-2xl font-black ${c.text} leading-none tracking-tight`}>
                  {stat.value}
                </p>

                {/* Label */}
                <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>

                {/* Trend */}
                <div className="flex items-center gap-1 mt-2">
                  {stat.trendUp ? (
                    <FiTrendingUp className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <FiTrendingDown className="w-3 h-3 text-rose-500" />
                  )}
                  <span className="text-[10px] font-semibold text-slate-400">
                    {stat.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
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