import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider.jsx';
import { createProject } from '../../apis/api';
import { FiX, FiPlus, FiTarget, FiFileText, FiCpu } from 'react-icons/fi';

export default function NewProjectModal({ open = true, onClose = () => {} }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ projectName: '', project_description: '' });
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const userId = user?._id || user?.id || user?.userId;
    if (!userId) return console.error('No user id available');

    setLoading(true);
    try {
      const payload = { userId, projectName: form.projectName, project_description: form.project_description };
      const resp = await createProject(payload);
      const project = resp?.data ?? resp;
      if (project) {
        const projectId = project.id || project._id || project.projectId;
        onClose();
        navigate(`/project/${projectId}`);
      }
    } catch (err) {
      console.error('Failed to initialize logic instance:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* --- BACKDROP --- */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* --- MODAL CARD --- */}
      <div className="relative bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200/60 shadow-2xl shadow-slate-900/20 w-full max-w-lg overflow-hidden z-50 animate-in zoom-in-95 fade-in duration-300">
        
        {/* Header Section */}
        <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
              <FiPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Initialize Workspace</h3>
              <div className="flex items-center gap-1.5 text-indigo-500 mt-0.5">
                <FiCpu className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">New Logic Instance</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-400 hover:text-rose-500 transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Project Name Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <FiTarget className="w-3.5 h-3.5 text-indigo-500" />
              Project Identifier
            </label>
            <input
              name="projectName"
              placeholder="e.g., Enron Audit FY26"
              value={form.projectName}
              onChange={onChange}
              required
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 text-sm font-bold transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <FiFileText className="w-3.5 h-3.5 text-indigo-500" />
              Instance Context & Scope
            </label>
            <textarea
              name="project_description"
              placeholder="Describe the deterministic synthesis goals..."
              value={form.project_description}
              onChange={onChange}
              rows={4}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 text-sm font-medium transition-all placeholder:text-slate-300 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 disabled:opacity-60 active:scale-95"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  INITIATING...
                </>
              ) : (
                'CREATE INSTANCE'
              )}
            </button>
          </div>
        </form>

        {/* Subtle Blueprint Texture Overlay */}
        <div className="absolute inset-0 -z-10 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      </div>
    </div>
  );
}