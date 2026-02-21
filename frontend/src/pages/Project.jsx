import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { FiMenu, FiX, FiLayers, FiArrowLeft } from 'react-icons/fi';
import ProjectProvider, { useProject } from '../components/providers/ProjectProvider';
import ProjectSidebar from '../components/projectSubComponents/ProjectSidebar';
import StatusTimeline from '../components/projectSubComponents/StatusTimeline';

// Pipeline Steps
import Step0_Ingestion from '../components/pipeline/Step0_Ingestion';
import Step1_Stakeholders from '../components/pipeline/Step1_Stakeholders';
import Step2_Facts from '../components/pipeline/Step2_Facts';
import Step3_Conflicts from '../components/pipeline/Step3_Conflicts';
import Step4_HITL from '../components/pipeline/Step4_HITL';
import Step5_BRD from '../components/pipeline/Step5_BRD';

const STEP_LABELS = [
  'Ingestion',
  'Stakeholders',
  'Facts',
  'Conflicts',
  'HITL',
  'BRD',
];

const STEP_COLORS = [
  'text-indigo-600 bg-indigo-50',
  'text-rose-600 bg-rose-50',
  'text-amber-600 bg-amber-50',
  'text-rose-600 bg-rose-50',
  'text-purple-600 bg-purple-50',
  'text-emerald-600 bg-emerald-50',
];

function PipelineContent() {
  const { project, loading } = useProject() || {};
  const status = project?.status ?? 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-32">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-400">Loading project...</p>
      </div>
    );
  }

  switch (status) {
    case 0: return <Step0_Ingestion />;
    case 1: return <Step1_Stakeholders />;
    case 2: return <Step2_Facts />;
    case 3: return <Step3_Conflicts />;
    case 4: return <Step4_HITL />;
    case 5: return <Step5_BRD />;
    default: return <Step5_BRD />;
  }
}

function InnerProjectPage() {
  const [open, setOpen] = React.useState(false);
  const { project, loading } = useProject() || {};
  const status = project?.status ?? 0;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">

      {/* ─── FIXED TOP NAVIGATION ─── */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="w-full h-14 px-3 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"
            >
              <FiMenu className="w-4 h-4" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-slate-400">
              <FiLayers className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-tighter">System / Workspace</span>
            </div>
          </div>

          {/* Center: Title */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-0.5">Anvaya Logic Engine</span>
            <h1 className="text-sm font-black text-slate-800 tracking-tight">
              {loading ? 'Reconciling Data...' : (project?.projectName || 'New Workspace')}
            </h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Stage Badge */}
            {project && (
              <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${STEP_COLORS[Math.min(status, 5)]}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                Stage {status}: {STEP_LABELS[Math.min(status, 5)]}
              </div>
            )}
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          </div>
        </div>

        {/* Progress Timeline — sub-bar */}
        <div className="px-4 py-2 border-t border-slate-100 bg-white/60">
          <StatusTimeline />
        </div>
      </header>

      {/* ─── SIDEBAR DRAWER ─── */}
      <div className={`fixed inset-0 z-60 transition-all duration-500 ${open ? 'visible' : 'pointer-events-none'}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside className={`absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl transform transition-transform duration-500 ease-out border-r border-slate-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-14 flex items-center justify-between px-3 border-b border-slate-100">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Context Selector</span>
            <button onClick={() => setOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
              <FiX className="w-4 h-4" />
            </button>
          </div>
          <div className="h-[calc(100vh-3.5rem)] overflow-y-auto custom-scrollbar">
            <ProjectSidebar compact onClose={() => setOpen(false)} />
          </div>
        </aside>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      {/* offset: h-14 nav + ~3rem timeline sub-bar = pt-28 */}
      <main className="pt-28 pb-10 min-h-screen">
        <PipelineContent />
      </main>
    </div>
  );
}

function FetchProjectOnRoute() {
  const { id } = useParams();
  const { fetchProject } = useProject() || {};

  React.useEffect(() => {
    if (!id || !fetchProject) return;
    fetchProject(id).catch(() => { });
  }, [id, fetchProject]);

  return null;
}

export default function ProjectPageWrapper() {
  return (
    <ProjectProvider>
      <FetchProjectOnRoute />
      <InnerProjectPage />
    </ProjectProvider>
  );
}
