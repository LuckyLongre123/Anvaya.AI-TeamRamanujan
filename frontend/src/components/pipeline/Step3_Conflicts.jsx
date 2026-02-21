import React, { useEffect, useState } from 'react';
import { FiGitBranch, FiAlertTriangle, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { useProject } from '../providers/ProjectProvider';
import { findContradictions, increamentProjectStatus } from '../../apis/api';
import { toast } from 'sonner';

function ConflictCard({ contradiction, allFacts, index }) {
    const conflictFacts = (contradiction.contradiction_facts || []).map(id =>
        allFacts.find(f => f.id === id)
    ).filter(Boolean);

    return (
        <div className="bg-white border border-rose-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
            {/* Card Header */}
            <div className="flex items-center gap-3 px-5 py-3 bg-rose-50 border-b border-rose-100">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                    <FiAlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Conflict #{index + 1}</span>
                    <p className="text-xs text-rose-600 font-medium mt-0.5 leading-relaxed">{contradiction.context}</p>
                </div>
                <div className="shrink-0 px-2 py-1 bg-rose-100 rounded-full text-[10px] font-black text-rose-500">
                    {conflictFacts.length} Facts
                </div>
            </div>

            {/* Clashing Facts */}
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {conflictFacts.map((fact, i) => {
                    const content = typeof fact.content === 'object'
                        ? (fact.content?.statement || JSON.stringify(fact.content))
                        : String(fact.content);
                    return (
                        <div key={fact.id} className={`p-3 rounded-xl border text-xs ${i === 0 ? 'bg-indigo-50 border-indigo-200' : 'bg-amber-50 border-amber-200'}`}>
                            <div className={`text-[10px] font-black uppercase mb-1.5 ${i === 0 ? 'text-indigo-500' : 'text-amber-600'}`}>
                                {i === 0 ? '◈ Claim A' : '◈ Claim B'}
                            </div>
                            <p className={`leading-relaxed font-medium ${i === 0 ? 'text-indigo-800' : 'text-amber-800'}`}>{content}</p>
                            <div className="mt-2 text-[10px] opacity-70">
                                📍 {fact.source}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function Step3_Conflicts() {
    const { project, fetchProject, contradictions, setContradictions, facts } = useProject() || {};
    const [loading, setLoading] = useState(false);
    const [advancing, setAdvancing] = useState(false);

    const localContradictions = contradictions || [];
    const localFacts = facts || [];

    useEffect(() => {
        if (project?.id && localContradictions.length === 0) {
            runDetection();
        }
    }, [project?.id]);

    const runDetection = async () => {
        if (!project?.id) return;
        setLoading(true);
        try {
            const res = await findContradictions(project.id);
            const list = res?.data || res || [];
            if (setContradictions) setContradictions(Array.isArray(list) ? list : []);
            toast.success(`${Array.isArray(list) ? list.length : 0} contradiction(s) detected.`);
        } catch (err) {
            toast.error('Conflict detection failed');
        } finally {
            setLoading(false);
        }
    };

    const handleAdvance = async () => {
        if (!project?.id) return;
        setAdvancing(true);
        try {
            await increamentProjectStatus(project.id);
            await fetchProject(project.id);
            toast.success('Opening HITL Resolution Console →');
        } catch (err) {
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
                        <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Stage 3 — DAG Conflict Detection</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Requirement Drift Analysis</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Directed Acyclic Graph logic engine scanning for contradictions across {localFacts.length} atomic facts.
                    </p>
                </div>
                <button
                    onClick={runDetection}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                    <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Re-scan
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <div className="text-2xl font-black text-slate-800">{localFacts.length}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Facts Scanned</div>
                </div>
                <div className="p-4 bg-white border border-rose-200 rounded-xl shadow-sm bg-rose-50">
                    <div className="text-2xl font-black text-rose-600">{localContradictions.length}</div>
                    <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wide">Conflicts Found</div>
                </div>
                <div className="p-4 bg-white border border-emerald-200 rounded-xl shadow-sm bg-emerald-50">
                    <div className="text-2xl font-black text-emerald-600">{localFacts.length - (localContradictions.length * 2)}</div>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Clean Facts</div>
                </div>
            </div>

            {/* Conflict Cards */}
            {loading && (
                <div className="flex flex-col items-center py-16">
                    <div className="relative w-16 h-16 mb-4">
                        <div className="absolute inset-0 border-4 border-rose-200 rounded-full animate-ping opacity-30" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <FiGitBranch className="w-7 h-7 text-rose-500 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-sm font-bold text-slate-500">DAG engine scanning for requirement drift...</p>
                </div>
            )}

            {!loading && localContradictions.length > 0 && (
                <div className="space-y-4">
                    {localContradictions.map((c, i) => (
                        <ConflictCard key={c.id || i} contradiction={c} allFacts={localFacts} index={i} />
                    ))}
                </div>
            )}

            {!loading && localContradictions.length === 0 && (
                <div className="flex flex-col items-center py-16 border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50/30">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                        <span className="text-2xl">✓</span>
                    </div>
                    <p className="text-sm font-bold text-emerald-600">No contradictions detected</p>
                    <p className="text-xs text-emerald-500 mt-1">All facts are logically consistent. You can proceed directly to BRD synthesis.</p>
                </div>
            )}

            {/* CTA */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl shadow-xl shadow-purple-200">
                <div>
                    <div className="text-white font-black text-sm">Open HITL Resolution Console</div>
                    <div className="text-purple-200 text-xs mt-0.5">
                        {localContradictions.length > 0
                            ? `Resolve ${localContradictions.length} conflict(s) before BRD synthesis`
                            : 'No conflicts — proceed directly to BRD synthesis'}
                    </div>
                </div>
                <button
                    onClick={handleAdvance}
                    disabled={advancing || loading}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-purple-700 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {advancing ? (
                        <><span className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />Advancing...</>
                    ) : (
                        <>Open HITL <FiArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </div>
        </div>
    );
}
