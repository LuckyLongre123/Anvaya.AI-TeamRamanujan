import React, { useState } from 'react';
import { FiUsers, FiArrowRight, FiUser, FiTrendingUp, FiTrash2, FiZap } from 'react-icons/fi';
import { useAuth } from '../providers/AuthProvider';
import { useProject } from '../providers/ProjectProvider';
import { mapStakeholders, deleteStakeholder, increamentProjectStatus } from '../../apis/api';
import { toast } from 'sonner';

const influenceConfig = {
    High: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-400' },
    Medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400' },
    Low: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400' },
};

const stanceConfig = {
    Supportive: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    Neutral: { bg: 'bg-slate-100', text: 'text-slate-600' },
    Skeptical: { bg: 'bg-amber-100', text: 'text-amber-700' },
    Blocking: { bg: 'bg-rose-100', text: 'text-rose-700' },
};

function StakeholderCard({ s, onDelete, deleting }) {
    const inf = influenceConfig[s.influence] || influenceConfig.Medium;
    const stance = stanceConfig[s.stance] || stanceConfig.Neutral;

    return (
        <div className={`relative p-5 rounded-2xl border ${inf.border} ${inf.bg} hover:shadow-md transition-all duration-300 group`}>
            {/* Influence dot */}
            <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${inf.dot}`} title={`${s.influence} Influence`} />

            {/* Delete button – visible on hover */}
            <button
                onClick={() => onDelete(s.id)}
                disabled={deleting}
                title="Remove stakeholder"
                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 disabled:opacity-40"
            >
                <FiTrash2 className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                    <FiUser className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-slate-800 truncate">{s.name}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{s.role}</p>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                    <FiTrendingUp className={`w-3 h-3 ${inf.text}`} />
                    <span className={`text-[10px] font-black uppercase tracking-wide ${inf.text}`}>{s.influence} Influence</span>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${stance.bg} ${stance.text}`}>
                    {s.stance}
                </div>
            </div>
        </div>
    );
}

export default function Step1_Stakeholders() {
    const { testUser } = useAuth();
    const { project, fetchProject, stakeholders, setStakeholders } = useProject() || {};
    const [extracting, setExtracting] = useState(false);
    const [advancing, setAdvancing] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const localStakeholders = stakeholders || [];

    // ── Extract (re-run) stakeholders ──────────────────────────────────────
    const handleExtract = async () => {
        if (!project?.id || !testUser?.data_vault) return;
        setExtracting(true);
        try {
            const dv = testUser.data_vault;
            const relevantChats = {};
            ['gmail', 'whatsapp', 'slack', 'meetings'].forEach(ch => {
                const arr = dv[ch];
                if (Array.isArray(arr)) {
                    const rel = arr.filter(t => t.is_relevant !== false);
                    if (rel.length) relevantChats[ch] = rel;
                }
            });
            const res = await mapStakeholders(project.id, relevantChats);
            const list = res?.data || res || [];
            if (setStakeholders) setStakeholders(Array.isArray(list) ? list : []);
            toast.success('Stakeholders extracted successfully!');
        } catch {
            toast.error('Extraction failed');
        } finally {
            setExtracting(false);
        }
    };

    // ── Delete a single stakeholder ────────────────────────────────────────
    const handleDelete = async (stakeholderId) => {
        if (!project?.id || !stakeholderId) return;
        setDeletingId(stakeholderId);
        try {
            await deleteStakeholder(project.id, stakeholderId);
            if (setStakeholders) {
                setStakeholders(prev => (prev || []).filter(s => s.id !== stakeholderId));
            }
        } catch {
            // toast already shown by api helper
        } finally {
            setDeletingId(null);
        }
    };

    // ── Advance to next stage ──────────────────────────────────────────────
    const handleAdvance = async () => {
        if (!project?.id) return;
        setAdvancing(true);
        try {
            await increamentProjectStatus(project.id);
            await fetchProject(project.id);
            toast.success('Moving to Atomic Fact Extraction →');
        } catch {
            toast.error('Failed to advance stage');
        } finally {
            setAdvancing(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-100 rounded-full mb-4">
                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Stage 1 — Stakeholder Mapping</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Organizational Authority Map</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {localStakeholders.length} stakeholder{localStakeholders.length !== 1 ? 's' : ''} identified from your communications.
                    </p>
                </div>

                {/* Extract Stakeholders button (replaces "Re-run") */}
                <button
                    onClick={handleExtract}
                    disabled={extracting}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all disabled:opacity-50 shadow-sm shadow-rose-200"
                >
                    {extracting ? (
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <FiZap className="w-3.5 h-3.5" />
                    )}
                    {extracting ? 'Extracting…' : 'Extract Stakeholders'}
                </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
                {['High', 'Medium', 'Low'].map(level => {
                    const count = localStakeholders.filter(s => s.influence === level).length;
                    const cfg = influenceConfig[level];
                    return (
                        <div key={level} className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg}`}>
                            <div className={`text-2xl font-black ${cfg.text}`}>{count}</div>
                            <div className={`text-[10px] font-bold uppercase tracking-wide ${cfg.text} opacity-70`}>{level} Influence</div>
                        </div>
                    );
                })}
            </div>

            {/* Stakeholder Grid */}
            {localStakeholders.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {localStakeholders.map((s, i) => (
                        <StakeholderCard
                            key={s.id || i}
                            s={s}
                            onDelete={handleDelete}
                            deleting={deletingId === s.id}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
                    <FiUsers className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-sm font-bold text-slate-400">No stakeholders extracted yet</p>
                    <p className="text-xs text-slate-400 mt-1">Click "Extract Stakeholders" to identify them from your data vault.</p>
                </div>
            )}

            {/* CTA */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-rose-600 to-rose-700 rounded-2xl shadow-xl shadow-rose-200">
                <div>
                    <div className="text-white font-black text-sm">Proceed to Atomic Fact Extraction</div>
                    <div className="text-rose-200 text-xs mt-0.5">Stage 2 will decompose communications into verifiable atomic claims</div>
                </div>
                <button
                    onClick={handleAdvance}
                    disabled={advancing || localStakeholders.length === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-rose-700 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {advancing ? (
                        <><span className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />Advancing...</>
                    ) : (
                        <>Extract Facts <FiArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </div>
        </div>
    );
}
