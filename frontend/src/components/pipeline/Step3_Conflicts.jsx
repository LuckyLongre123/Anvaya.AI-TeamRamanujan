import React, { useEffect, useState } from 'react';
import {
    FiGitBranch, FiAlertTriangle, FiArrowRight, FiRefreshCw,
    FiCheck, FiEdit3, FiLink, FiZap
} from 'react-icons/fi';
import { useProject } from '../providers/ProjectProvider';
import { findContradictions, resolveContradiction, increamentProjectStatus } from '../../apis/api';
import { toast } from 'sonner';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getContent(fact) {
    if (!fact) return '(fact not found)';
    return typeof fact.content === 'object'
        ? (fact.content?.statement || JSON.stringify(fact.content))
        : String(fact.content);
}

function getFactIndex(facts, factId) {
    const idx = facts.findIndex(f => f.id === factId);
    return idx >= 0 ? `FACT-${String(idx + 1).padStart(3, '0')}` : factId?.slice(-6) || '?';
}

// ─── CONFLICT CARD WITH INLINE RESOLUTION ────────────────────────────────────

function ConflictCard({ contradiction, allFacts, index, onResolved }) {
    const conflictFacts = (contradiction.contradiction_facts || []).map(id =>
        allFacts.find(f => f.id === id)
    ).filter(Boolean);

    const factA = conflictFacts[0];
    const factB = conflictFacts[1];

    const [mode, setMode] = useState(null);       // 'A' | 'B' | 'custom'
    const [customInput, setCustomInput] = useState('');
    const [reasoning, setReasoning] = useState('');
    const [resolving, setResolving] = useState(false);
    const [resolved, setResolved] = useState(false);

    const canSubmit = mode && reasoning.trim() && (mode !== 'custom' || customInput.trim());

    const handleResolve = async () => {
        if (!canSubmit) return;
        setResolving(true);
        try {
            const payload = {
                contradictionId: contradiction.id,
                reasoning,
                ...(mode === 'custom'
                    ? { custom_input: customInput }
                    : { winnerFactId: mode === 'A' ? factA.id : factB.id }),
            };
            await resolveContradiction(
                contradiction.projectId || contradiction.project_id,
                payload
            );
            setResolved(true);
            if (onResolved) onResolved(contradiction.id);
        } catch {
            // toast shown by api.js
        } finally {
            setResolving(false);
        }
    };

    if (resolved) {
        const winnerLabel = mode === 'A' ? 'Claim A' : mode === 'B' ? 'Claim B' : 'Custom Input';
        return (
            <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-md shadow-emerald-50 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border-b border-emerald-100">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <FiCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">✓ Conflict #{index + 1} Resolved</div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{contradiction.context}</p>
                    </div>
                    <div className="px-3 py-1 bg-emerald-100 rounded-full text-[10px] font-black text-emerald-700">
                        Adopted: {winnerLabel}
                    </div>
                </div>
                <div className="p-4">
                    <p className="text-xs text-slate-600 italic">📋 {reasoning}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border-2 border-rose-200 shadow-md overflow-hidden">
            {/* Header */}
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

            <div className="p-5 space-y-4">
                {/* Claim cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {factA && (
                        <div
                            onClick={() => setMode('A')}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${mode === 'A' ? 'border-indigo-500 bg-indigo-50 scale-[1.01]' : 'border-slate-200 hover:border-indigo-300 bg-slate-50'}`}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-black text-indigo-700 uppercase">◈ Adopt Claim A</span>
                                <span className="text-[9px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold">{getFactIndex(allFacts, factA.id)}</span>
                                {mode === 'A' && <FiCheck className="w-3.5 h-3.5 text-indigo-600" />}
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">{getContent(factA)}</p>
                            <p className="mt-1.5 text-[10px] text-slate-400">📍 {factA.source}</p>
                        </div>
                    )}
                    {factB && (
                        <div
                            onClick={() => setMode('B')}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${mode === 'B' ? 'border-amber-500 bg-amber-50 scale-[1.01]' : 'border-slate-200 hover:border-amber-300 bg-slate-50'}`}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-black text-amber-700 uppercase">◈ Adopt Claim B</span>
                                <span className="text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-bold">{getFactIndex(allFacts, factB.id)}</span>
                                {mode === 'B' && <FiCheck className="w-3.5 h-3.5 text-amber-600" />}
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">{getContent(factB)}</p>
                            <p className="mt-1.5 text-[10px] text-slate-400">📍 {factB.source}</p>
                        </div>
                    )}
                </div>

                {/* Custom option */}
                <div
                    className={`rounded-xl border-2 overflow-hidden transition-all duration-200 ${mode === 'custom' ? 'border-purple-400' : 'border-slate-200 hover:border-purple-300'}`}
                    onClick={() => { if (mode !== 'custom') setMode('custom'); }}
                >
                    <div className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${mode === 'custom' ? 'bg-purple-50' : 'bg-slate-50'}`}>
                        <FiEdit3 className={`w-3.5 h-3.5 ${mode === 'custom' ? 'text-purple-600' : 'text-slate-400'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-wide ${mode === 'custom' ? 'text-purple-700' : 'text-slate-500'}`}>Custom Resolution</span>
                        {mode === 'custom' && <FiCheck className="ml-auto w-3.5 h-3.5 text-purple-600" />}
                    </div>
                    {mode === 'custom' && (
                        <textarea
                            className="w-full px-3 py-2 text-xs text-slate-700 bg-white resize-none focus:outline-none border-t border-slate-100"
                            rows={3}
                            placeholder="Enter your custom resolution..."
                            value={customInput}
                            onChange={e => setCustomInput(e.target.value)}
                            onClick={e => e.stopPropagation()}
                        />
                    )}
                </div>

                {/* Reasoning */}
                {mode && (
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide block mb-1.5">Reasoning (Required for Audit)</label>
                        <textarea
                            className="w-full px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                            rows={2}
                            placeholder="Document your rationale for audit lineage..."
                            value={reasoning}
                            onChange={e => setReasoning(e.target.value)}
                        />
                    </div>
                )}

                {/* Resolve button */}
                {mode && (
                    <button
                        onClick={handleResolve}
                        disabled={!canSubmit || resolving}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wide hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
                    >
                        {resolving ? (
                            <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Resolving...</>
                        ) : (
                            <><FiCheck className="w-3.5 h-3.5" />Resolve Conflict #{index + 1}</>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Step3_Conflicts() {
    const { project, fetchProject, contradictions, setContradictions, facts } = useProject() || {};
    const [loading, setLoading] = useState(false);
    const [advancing, setAdvancing] = useState(false);
    const [resolvedIds, setResolvedIds] = useState(new Set());

    const localContradictions = contradictions || [];
    const localFacts = facts || [];

    const allResolved = localContradictions.length > 0 && resolvedIds.size >= localContradictions.length;

    useEffect(() => {
        if (project?.id && localContradictions.length === 0) {
            runDetection();
        }
    }, [project?.id]);

    const runDetection = async () => {
        if (!project?.id) return;
        setLoading(true);
        setResolvedIds(new Set());
        try {
            const res = await findContradictions(project.id);
            const list = res?.data || res || [];
            if (setContradictions) setContradictions(Array.isArray(list) ? list : []);
            toast.success(`${Array.isArray(list) ? list.length : 0} contradiction(s) detected.`);
        } catch {
            toast.error('Conflict detection failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResolved = (contradictionId) => {
        setResolvedIds(prev => new Set([...prev, contradictionId]));
    };

    const handleAdvance = async () => {
        if (!project?.id) return;
        setAdvancing(true);
        try {
            await increamentProjectStatus(project.id);
            await fetchProject(project.id);
            toast.success('Moving to Fact-Based Summary →');
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
                        <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Stage 3 — Conflict Detection & Resolution</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Requirement Drift Analysis</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        DAG logic engine scanning for contradictions across {localFacts.length} atomic facts. Resolve each conflict inline.
                    </p>
                </div>
                <button
                    onClick={runDetection}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all disabled:opacity-50 shadow-sm shadow-rose-200"
                >
                    {loading ? (
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <FiZap className="w-3.5 h-3.5" />
                    )}
                    {loading ? 'Scanning…' : 'Detect Conflicts'}
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
                    <div className="text-2xl font-black text-emerald-600">{resolvedIds.size}</div>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Resolved</div>
                </div>
            </div>

            {/* Progress Bar */}
            {localContradictions.length > 0 && (
                <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-600">Resolution Progress</span>
                        <span className="text-xs font-black text-purple-600">{resolvedIds.size} / {localContradictions.length}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-700"
                            style={{ width: `${(resolvedIds.size / localContradictions.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Loading */}
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

            {/* Conflict Cards with Inline Resolution */}
            {!loading && localContradictions.length > 0 && (
                <div className="space-y-5">
                    {localContradictions.map((c, i) => (
                        <ConflictCard
                            key={c.id || i}
                            contradiction={c}
                            allFacts={localFacts}
                            index={i}
                            onResolved={handleResolved}
                        />
                    ))}
                </div>
            )}

            {/* No Conflicts */}
            {!loading && localContradictions.length === 0 && (
                <div className="flex flex-col items-center py-16 border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50/30">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                        <span className="text-2xl">✓</span>
                    </div>
                    <p className="text-sm font-bold text-emerald-600">No contradictions detected</p>
                    <p className="text-xs text-emerald-500 mt-1">All facts are logically consistent. You can proceed directly.</p>
                </div>
            )}

            {/* CTA */}
            <div className={`flex items-center justify-between p-6 rounded-2xl shadow-xl transition-all duration-300 ${(allResolved || localContradictions.length === 0)
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-purple-200'
                    : 'bg-slate-100 shadow-slate-100'
                }`}>
                <div>
                    <div className={`font-black text-sm ${(allResolved || localContradictions.length === 0) ? 'text-white' : 'text-slate-400'}`}>
                        {(allResolved || localContradictions.length === 0)
                            ? 'Proceed to Fact-Based Summary'
                            : `Resolve all ${localContradictions.length} conflicts to continue`}
                    </div>
                    <div className={`text-xs mt-0.5 ${(allResolved || localContradictions.length === 0) ? 'text-purple-200' : 'text-slate-400'}`}>
                        {localContradictions.length > 0
                            ? `${resolvedIds.size}/${localContradictions.length} conflicts resolved`
                            : 'No conflicts — proceed directly'}
                    </div>
                </div>
                <button
                    onClick={handleAdvance}
                    disabled={advancing || loading || (localContradictions.length > 0 && !allResolved)}
                    className={`flex items-center gap-2 px-6 py-3 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all ${(allResolved || localContradictions.length === 0)
                            ? 'bg-white text-purple-700 hover:bg-purple-50'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        } disabled:opacity-50`}
                >
                    {advancing ? (
                        <><span className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />Advancing...</>
                    ) : (
                        <>View Summary <FiArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </div>
        </div>
    );
}
