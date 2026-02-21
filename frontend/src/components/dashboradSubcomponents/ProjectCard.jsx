import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiMessageSquare, FiActivity, FiArrowRight, FiShield } from 'react-icons/fi';

export default function ProjectCard({ project }) {
  const name = project?.projectName || project?.name || project?.title || 'Untitled Project';
  const desc = project?.project_description || project?.description || project?.desc || 'No description provided for this instance.';
  const sources = Array.isArray(project?.included_messaging_source) ? project.included_messaging_source : project?.included_messaging_source ? [project.included_messaging_source] : [];
  const files = Array.isArray(project?.files) ? project.files : project?.files ? [project.files] : [];
  
  const statusMap = { 0: 'Initialized', 1: 'Active', 2: 'Archived' };
  const statusLabel = statusMap[project?.status] ?? 'Unknown Status';
  const isNew = project?.status === 0;

  const navigate = useNavigate();
  const projectId = project?.id || project?._id || project?.projectId;

  const goToProject = () => {
    if (!projectId) return;
    navigate(`/project/${projectId}`);
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={goToProject}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goToProject(); }}
      className="group relative flex flex-col bg-white/70 backdrop-blur-md rounded-4xl p-6 border border-slate-200/60 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-300 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-50"
      aria-label={`Open project ${name}`}
    >
      {/* --- HEADER: STATUS & TRACE ID --- */}
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isNew ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${isNew ? 'text-emerald-600' : 'text-slate-400'}`}>
            {statusLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300 group-hover:text-indigo-400 transition-colors">
          <FiShield className="w-3 h-3" />
          <span className="text-[9px] font-mono font-bold uppercase">
            ID: {projectId?.toString().slice(-6) || "ANV-???"}
          </span>
        </div>
      </header>

      {/* --- CONTENT: IDENTITY --- */}
      <div className="flex-1">
        <h4 className="text-lg font-black text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
          {name}
        </h4>
        <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
          {desc}
        </p>
      </div>

      {/* --- DATA METRICS: LINEAGE STATS --- */}
      <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
            <FiMessageSquare className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">Sources</span>
            <span className="text-xs font-bold text-slate-700">{sources.length || 0} Nodes</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
            <FiFileText className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">Files</span>
            <span className="text-xs font-bold text-slate-700">{files.length || 0} Assets</span>
          </div>
        </div>
      </div>

      {/* --- ACTION INDICATOR --- */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
        <FiArrowRight className="text-indigo-600 w-5 h-5" />
      </div>
    </article>
  );
}