import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { FiMail, FiMessageCircle, FiCalendar, FiDatabase, FiPlus, FiChevronDown, FiChevronRight, FiFileText } from 'react-icons/fi';
import { SiSlack } from 'react-icons/si';
import { useProject } from '../../components/providers/ProjectProvider';
import { uploadProjectFiles } from '../../apis/api';
import { toast } from 'sonner';

  export default function ProjectSidebar({ compact = false, relevantChats = {}, onClose = () => {} }) {
    const { testUser } = useAuth();
    const { project, fetchProject } = useProject() || {};
    const fileInputRef = useRef(null);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const channelsOfInterest = ['gmail', 'whatsapp', 'slack', 'meetings'];

    const [channelVisible, setChannelVisible] = useState(() => 
      channelsOfInterest.reduce((acc, c) => { acc[c] = true; return acc; }, {})
    );
    const [threadRelevance, setThreadRelevance] = useState({});

    useEffect(() => {
      if (!testUser?.data_vault) return;
      const dv = testUser.data_vault;
      const initRel = {};
      const initVis = {};
      channelsOfInterest.forEach((ch) => {
        const arr = dv[ch];
        if (!Array.isArray(arr)) return;
        arr.forEach((t, i) => {
          const key = `${ch}::${i}`;
          initRel[key] = !!t.is_relevant;
        });
        initVis[ch] = arr.length > 0;
      });
      // if no thread is marked relevant, default to selecting the first message of each channel
      const anySelected = Object.values(initRel).some(Boolean);
      if (!anySelected) {
        channelsOfInterest.forEach((ch) => {
          const arr = dv[ch];
          if (!Array.isArray(arr) || arr.length === 0) return;
          const key = `${ch}::0`;
          initRel[key] = true;
        });
      }
      setThreadRelevance(initRel);
      setChannelVisible(prev => ({ ...prev, ...initVis }));
    }, [testUser]);

    const toggleChannel = (ch) => {
      if (project?.status > 0) return toast.error('Project locked — cannot change channels');
      setChannelVisible(prev => ({ ...prev, [ch]: !prev[ch] }));
    };
    const toggleThread = (ch, idx) => {
      if (project?.status > 0) return toast.error('Project locked — cannot change threads');
      const key = `${ch}::${idx}`;
      setThreadRelevance(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const iconMap = {
      gmail: <FiMail className="text-rose-500" />,
      whatsapp: <FiMessageCircle className="text-emerald-500" />,
      slack: <SiSlack className="text-indigo-500" />,
      meetings: <FiCalendar className="text-amber-500" />,
    };

    return (
      <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200 w-80">
        {/* Project Header Card */}
        <div className="p-4 border-b border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-indigo-600">
            <FiDatabase className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Active Workspace</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">
            {project?.projectName || project?.name || "New Analysis"}
          </h2>
          {project?.project_description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">
              "{project.project_description}"
            </p>
          )}
        </div>

        {/* Project Files Section */}
        <div className="p-3 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
              <FiFileText />
              <span>Files</span>
            </div>
            <div className="flex items-center gap-2">
              {project?.status > 0 ? (
                <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-md font-bold">Locked</span>
              ) : (
                <button
                  onClick={() => setUploadOpen((s) => !s)}
                  className="text-xs px-2 py-1 bg-indigo-600 text-white rounded-md"
                >
                  Upload
                </button>
              )}
            </div>
          </div>

          {/* existing uploaded files */}
          {project?.status === 0 && (
            <div className="mb-2 text-xs bg-amber-50 border border-amber-100 text-amber-800 px-2 py-2 rounded-md">
              Warning: Uploading files (up to 5 .txt or .pdf) will lock this project and cannot be undone.
            </div>
          )}
          <div className="space-y-1">
            {Array.isArray(project?.files) && project.files.length ? (
              project.files.map((f, i) => (
                <a key={i} href={f?.url || f?.path || '#'} target="_blank" rel="noreferrer" className="block text-[12px] text-slate-700 hover:text-indigo-600 truncate">
                  {f?.originalname || f?.name || f?.filename || f?.title || `file-${i+1}`}
                </a>
              ))
            ) : (
              <div className="text-[12px] text-slate-400">No uploaded files</div>
            )}
          </div>

          {/* upload dropdown */}
          {uploadOpen && (
            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,application/pdf,text/plain"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length === 0) return;
                  if (files.length > 5) {
                    toast.error('Maximum 5 files per upload');
                    e.target.value = null;
                    return;
                  }
                  const valid = files.filter(f => f.type === 'application/pdf' || f.type === 'text/plain' || f.name.endsWith('.txt'));
                  if (valid.length !== files.length) {
                    toast.error('Only .txt and .pdf files are allowed');
                    e.target.value = null;
                    return;
                  }
                  setSelectedFiles(valid);
                }}
              />

              <div className="flex items-center justify-between">
                <button
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-md text-sm flex items-center gap-2"
                >
                  <FiPlus /> Choose files
                </button>

                <div className="text-sm text-slate-500">
                  {selectedFiles.length > 0 ? `${selectedFiles.length} selected` : 'No files selected'}
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-2 text-[12px] text-slate-700 max-h-28 overflow-auto">
                  {selectedFiles.map((f, i) => (
                    <div key={i} className="truncate">{f.name}</div>
                  ))}
                </div>
              )}

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={async () => {
                      if (!project) return toast.error('No project selected');
                      if (selectedFiles.length === 0) return toast.error('No files selected');
                      // ensure user has selected some messages/threads
                      const hasSelectedThreads = Object.values(threadRelevance || {}).some(Boolean);
                      if (!hasSelectedThreads) {
                        const okNoThreads = window.confirm('No messages are selected. It is recommended to select messages before uploading. Proceed without selecting messages?');
                        if (!okNoThreads) return;
                      }
                      // warn user that upload will lock project (backend increments status)
                      const proceed = window.confirm('Uploading files will lock this project (status will change). This cannot be undone. Proceed?');
                      if (!proceed) return;
                      setUploading(true);
                      try {
                        const projectId = project?.id || project?._id || project?.projectId;
                        await uploadProjectFiles(projectId, selectedFiles);
                        setSelectedFiles([]);
                        setUploadOpen(false);
                        if (typeof fetchProject === 'function') await fetchProject(projectId);
                      } catch (err) {
                        console.error(err);
                        toast.error('Upload failed');
                      } finally {
                        setUploading(false);
                      }
                    }}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>

                <button onClick={() => { setSelectedFiles([]); setUploadOpen(false); if (fileInputRef.current) fileInputRef.current.value = null; }} className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md text-sm">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Data Sources Section */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Data Context Sources
          </h3>
        
          <div className="space-y-3">
            {testUser?.data_vault ? channelsOfInterest.map((ch) => {
              const list = testUser.data_vault[ch];
              if (!Array.isArray(list) || list.length === 0) return null;
              const isOpen = channelVisible[ch];

              return (
                <div key={ch} className={`group border rounded-xl overflow-hidden transition-all duration-300 bg-white ${isOpen ? 'ring-1 ring-indigo-100 shadow-md' : 'hover:border-indigo-200'}`}>
                  {/* Channel Header */}
                  <div 
                    className={`flex items-center justify-between p-3 cursor-pointer ${isOpen ? 'bg-slate-50/50 border-b border-slate-100' : ''}`}
                    onClick={() => toggleChannel(ch)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg bg-white shadow-sm border border-slate-100`}>
                        {iconMap[ch]}
                      </div>
                      <span className="text-sm font-bold text-slate-700 capitalize">{ch}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-mono">
                        {list.length}
                      </span>
                    </div>
                    {isOpen ? <FiChevronDown className="text-slate-400" /> : <FiChevronRight className="text-slate-400" />}
                  </div>

                  {/* Thread List */}
                  {isOpen && (
                    <div className="p-2 space-y-1 bg-white animate-in slide-in-from-top-1 duration-200">
                      {list.map((item, idx) => {
                        const key = `${ch}::${idx}`;
                        const isRelevant = threadRelevance[key];
                        const title = item.name || item.subject || item.thread_id || item.title || `${ch} #${idx+1}`;
                      
                        return (
                          <div 
                            key={key} 
                            onClick={() => toggleThread(ch, idx)}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors
                              ${isRelevant ? 'bg-indigo-50/50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}>
                            <span className="text-xs font-medium truncate max-w-35">{title}</span>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                              ${isRelevant ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                              {isRelevant && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }) : (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-xs text-slate-400 font-medium px-4">Initialize Data Vault to begin analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }