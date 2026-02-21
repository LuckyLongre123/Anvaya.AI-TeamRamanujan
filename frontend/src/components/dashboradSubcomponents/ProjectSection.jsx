import React, { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { getProjectsByUserId } from '../../apis/api';
import ProjectCard from './ProjectCard';
import NewProjectModal from './NewProjectModal';
import { FiPlus, FiBriefcase, FiCpu, FiGrid } from 'react-icons/fi';

export default function ProjectSection() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    const userId = user.id || user._id || user?.userId;
    if (!userId) return;

    let mounted = true;
    setLoading(true);
    getProjectsByUserId(userId)
      .then((res) => {
        let list = [];
        if (!res) list = [];
        else if (Array.isArray(res)) list = res;
        else if (Array.isArray(res.data)) list = res.data;
        else if (Array.isArray(res.projects)) list = res.projects;
        else if (Array.isArray(res.data?.projects)) list = res.data.projects;
        else if (Array.isArray(res.data?.data)) list = res.data.data;
        else list = [];

        if (mounted) setProjects(list);
      })
      .catch((err) => {
        console.error('Failed to fetch projects', err);
        if (mounted) setProjects([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [user]);

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Section Header: Operations Control */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <FiGrid className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Instance Repository</span>
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Active Projects</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Managing {projects.length} synthesis workflows in the current logic vault.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="group inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
          <FiPlus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Initialize Project
        </button>
      </div>

      {/* Dynamic Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white/40 border border-slate-100 rounded-4xl animate-pulse flex items-center justify-center">
               <FiCpu className="w-6 h-6 text-slate-200 animate-spin" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 mb-4">
            <FiBriefcase className="w-8 h-8 text-slate-300" />
          </div>
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">No Projects Found</h4>
          <p className="text-xs text-slate-400 mt-2 max-w-50 font-medium leading-relaxed">
            Initialize your first workspace to begin deterministic BRD synthesis.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id || p._id || p.projectId} project={p} />
          ))}
        </div>
      )}

      {/* Blueprint Texture Background (Subtle) */}
      <div className="absolute inset-0 -z-10 opacity-[0.01] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      <NewProjectModal open={showNewModal} onClose={() => setShowNewModal(false)} />
    </section>
  );
}