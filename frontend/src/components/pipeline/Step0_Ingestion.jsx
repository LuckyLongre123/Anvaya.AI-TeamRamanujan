import React, { useState } from 'react';
import { FiMail, FiMessageCircle, FiCalendar, FiFileText, FiZap, FiUpload, FiDatabase, FiAlertTriangle } from 'react-icons/fi';
import { SiSlack } from 'react-icons/si';
import { useAuth } from '../providers/AuthProvider';
import { useProject } from '../providers/ProjectProvider';
import { mapStakeholders, increamentProjectStatus } from '../../apis/api';
import { toast } from 'sonner';

const channelMeta = {
  gmail:    { icon: <FiMail className="w-4 h-4 text-rose-500" />,     label: 'Gmail',     color: 'rose' },
  whatsapp: { icon: <FiMessageCircle className="w-4 h-4 text-emerald-500" />, label: 'WhatsApp', color: 'emerald' },
  slack:    { icon: <SiSlack className="w-4 h-4 text-indigo-500" />,  label: 'Slack',     color: 'indigo' },
  meetings: { icon: <FiCalendar className="w-4 h-4 text-amber-500" />, label: 'Meetings',  color: 'amber' },
};

export default function Step0_Ingestion() {
  const { testUser } = useAuth();
  const { project, fetchProject } = useProject() || {};
  const [running, setRunning] = useState(false);

  const dv = testUser?.data_vault || {};
  const channels = Object.keys(channelMeta).filter(ch => Array.isArray(dv[ch]) && dv[ch].length > 0);
  const relevantCount = channels.reduce((acc, ch) => {
    return acc + dv[ch].filter(t => t.is_relevant !== false).length;
  }, 0);
  const files = project?.files || [];
  const hasFiles = files.length > 0;

  const buildRelevantChats = () => {
    const result = {};
    channels.forEach(ch => {
      const relevant = dv[ch].filter(t => t.is_relevant !== false);
      if (relevant.length > 0) result[ch] = relevant;
    });
    return result;
  };

  const handleBegin = async () => {
    if (!project?.id) return toast.error('No project selected');
    if (!hasFiles) return toast.error('Please upload at least one file first via the sidebar');
    if (!testUser?.data_vault) return toast.error('Data vault not available for this user');

    setRunning(true);
    try {
      const relevantChats = buildRelevantChats();
      await mapStakeholders(project.id, relevantChats);
      await increamentProjectStatus(project.id);
      await fetchProject(project.id);
      toast.success('Stakeholders extracted! Moving to Stage 1.');
    } catch (err) {
      console.error(err);
      toast.error('Stakeholder mapping failed. Check console.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-4">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Stage 0 — Ingestion</span>
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Data Vault Configuration</h2>
        <p className="text-sm text-slate-500 mt-1">Review your selected data sources, then launch the Anvaya Discovery pass to extract stakeholders.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Uploaded Files */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <FiFileText className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-700 uppercase tracking-wide">Project Files</div>
              <div className="text-[10px] text-slate-400">Documents ingested into Google AI</div>
            </div>
          </div>

          {hasFiles ? (
            <div className="space-y-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-xs text-slate-700 font-medium truncate">{f.name || `file-${i+1}`}</span>
                  <span className="ml-auto text-[10px] text-emerald-600 font-bold">✓ SYNCED</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
              <FiUpload className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-400 font-medium text-center">No files yet.<br />Use the sidebar Upload button.</p>
            </div>
          )}
        </div>

        {/* Channel Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <FiDatabase className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-700 uppercase tracking-wide">Communication Channels</div>
              <div className="text-[10px] text-slate-400">{relevantCount} threads selected for analysis</div>
            </div>
          </div>

          <div className="space-y-2">
            {channels.map(ch => {
              const meta = channelMeta[ch];
              const items = dv[ch];
              const relevant = items.filter(t => t.is_relevant !== false);
              return (
                <div key={ch} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    {meta.icon}
                    <span className="text-xs font-bold text-slate-700">{meta.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{relevant.length}/{items.length} threads</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                </div>
              );
            })}
            {channels.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No data vault loaded for this user.</p>
            )}
          </div>
        </div>
      </div>

      {/* Warning if no files */}
      {!hasFiles && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <FiAlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-amber-800">Upload Required</p>
            <p className="text-xs text-amber-600 mt-0.5">Open the sidebar ☰ and upload at least one .txt or .pdf file to lock in your project context before proceeding.</p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl shadow-xl shadow-indigo-200">
        <div>
          <div className="text-white font-black text-sm">Begin Anvaya Discovery Pass</div>
          <div className="text-indigo-200 text-xs mt-0.5">Extracts stakeholders from all selected data sources</div>
        </div>
        <button
          onClick={handleBegin}
          disabled={running || !hasFiles}
          className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {running ? (
            <><span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />Running...</>
          ) : (
            <><FiZap className="w-4 h-4" />Launch Stage 1</>
          )}
        </button>
      </div>
    </div>
  );
}
