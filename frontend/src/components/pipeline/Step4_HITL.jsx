import React, { useState } from 'react';
import { FiUserCheck, FiCheck, FiEdit3, FiArrowRight, FiAlertTriangle, FiGitBranch, FiLink } from 'react-icons/fi';
import { useProject } from '../providers/ProjectProvider';
import { resolveContradiction, generateBRD } from '../../apis/api';
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
    return idx >= 0 ? `FACT-${String(idx + 1).padStart(3, '0')}` : factId?.slice(-6) || 'UNKNOWN';
}

// ─── DAG SUMMARY ─────────────────────────────────────────────────────────────

function DAGSummary({ contradictions, allFacts, resolutions }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-200">
                <FiGitBranch className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Resolution DAG — Audit Trail</span>
            </div>

            <div className="p-5 space-y-4">
                {contradictions.map((c, i) => {
                    const r = resolutions[c.id];
                    if (!r) return null;

                    const conflictFacts = (c.contradiction_facts || []).map(id =>
                        allFacts.find(f => f.id === id)
                    ).filter(Boolean);

                    const factA = conflictFacts[0];
                    const factB = conflictFacts[1];

                    // Determine what was chosen
                    let chosenLabel = '';
                    let chosenContent = '';
                    let chosenRef = '';
                    let chosenColor = '';

                    if (r.mode === 'A' && factA) {
                        chosenLabel = 'Adopted Claim A';
                        chosenContent = getContent(factA);
                        chosenRef = getFactIndex(allFacts, factA.id);
                        chosenColor = 'indigo';
                    } else if (r.mode === 'B' && factB) {
                        chosenLabel = 'Adopted Claim B';
                        chosenContent = getContent(factB);
                        chosenRef = getFactIndex(allFacts, factB.id);
                        chosenColor = 'amber';
                    } else if (r.mode === 'custom') {
                        chosenLabel = 'Custom Resolution';
                        chosenContent = r.custom_input || '';
                        chosenRef = 'Custom Input';
                        chosenColor = 'purple';
                    }

                    const colorMap = {
                        indigo: { badge: 'bg-indigo-100 text-indigo-700 border-indigo-200', line: 'bg-indigo-400', card: 'bg-indigo-50 border-indigo-200' },
                        amber: { badge: 'bg-amber-100 text-amber-700 border-amber-200', line: 'bg-amber-400', card: 'bg-amber-50 border-amber-200' },
                        purple: { badge: 'bg-purple-100 text-purple-700 border-purple-200', line: 'bg-purple-400', card: 'bg-purple-50 border-purple-200' },
                    };
                    const cm = colorMap[chosenColor] || colorMap.indigo;

                    return (
                        <div key={c.id} className="relative pl-6">
                            {/* Vertical line */}
                            {i < contradictions.length - 1 && (
                                <div className="absolute left-2.5 top-8 w-0.5 h-full bg-slate-200" />
                            )}

                            {/* Node dot */}
                            <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-white border-2 border-rose-400 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-rose-400" />
                            </div>

                            {/* Conflict label */}
                            <div className="mb-2">
                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Conflict #{i + 1}</span>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{c.context}</p>
                            </div>

                            {/* Clashing facts */}
                            <div className="grid grid-cols-2 gap-2 mb-2 ml-2">
                                <div className="p-2 rounded-lg border bg-slate-50 border-slate-200">
                                    <div className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Claim A · {factA ? getFactIndex(allFacts, factA.id) : '?'}</div>
                                    <p className="text-[11px] text-slate-600 leading-tight">{factA ? getContent(factA).slice(0, 80) + '...' : '?'}</p>
                                </div>
                                <div className="p-2 rounded-lg border bg-slate-50 border-slate-200">
                                    <div className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Claim B · {factB ? getFactIndex(allFacts, factB.id) : '?'}</div>
                                    <p className="text-[11px] text-slate-600 leading-tight">{factB ? getContent(factB).slice(0, 80) + '...' : '?'}</p>
                                </div>
                            </div>

                            {/* Arrow + Decision */}
                            <div className="flex items-center gap-2 ml-2 mb-2">
                                <div className={`w-0.5 h-6 ${cm.line} ml-2`} />
                            </div>
                            <div className={`ml-2 p-3 rounded-xl border ${cm.card}`}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-1.5">
                                        <FiCheck className={`w-3 h-3 ${chosenColor === 'indigo' ? 'text-indigo-600' : chosenColor === 'amber' ? 'text-amber-600' : 'text-purple-600'}`} />
                                        <span className={`text-[9px] font-black uppercase tracking-wide ${chosenColor === 'indigo' ? 'text-indigo-700' : chosenColor === 'amber' ? 'text-amber-700' : 'text-purple-700'}`}>{chosenLabel}</span>
                                    </div>
                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black ${cm.badge}`}>
                                        <FiLink className="w-2 h-2" />
                                        {chosenRef}
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-700 leading-relaxed">{chosenContent.slice(0, 140)}{chosenContent.length > 140 ? '...' : ''}</p>
                                {r.reasoning && (
                                    <p className="mt-1.5 text-[10px] text-slate-500 italic">📋 Reasoning: {r.reasoning}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── HITL CARD ────────────────────────────────────────────────────────────────

function HITLCard({ contradiction, allFacts, resolution, onUpdate }) {
    const conflictFacts = (contradiction.contradiction_facts || []).map(id =>
        allFacts.find(f => f.id === id)
    ).filter(Boolean);

    const factA = conflictFacts[0];
    const factB = conflictFacts[1];
    const isResolved = resolution?.mode && resolution?.reasoning;

    return (
        <div className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isResolved ? 'border-emerald-200 shadow-md shadow-emerald-50' : 'border-rose-200 shadow-md'}`}>
            <div className={`flex items-center gap-3 px-5 py-3 border-b ${isResolved ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isResolved ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                    {isResolved ? <FiCheck className="w-4 h-4 text-emerald-600" /> : <FiAlertTriangle className="w-4 h-4 text-rose-600" />}
                </div>
                <div className="flex-1">
                    <div className={`text-[10px] font-black uppercase tracking-widest ${isResolved ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isResolved ? '✓ Resolved' : '⚠ Awaiting Resolution'}
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">{contradiction.context}</p>
                </div>
            </div>

            <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option A */}
                    {factA && (
                        <div
                            onClick={() => onUpdate({ ...resolution, mode: 'A', winnerFactId: factA.id, custom_input: undefined })}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${resolution?.mode === 'A' ? 'border-indigo-500 bg-indigo-50 scale-[1.01]' : 'border-slate-200 hover:border-indigo-300 bg-slate-50'}`}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-black text-indigo-700 uppercase">◈ Adopt Claim A</span>
                                <span className="text-[9px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold">{getFactIndex(allFacts, factA.id)}</span>
                                {resolution?.mode === 'A' && <FiCheck className="w-3.5 h-3.5 text-indigo-600" />}
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">{getContent(factA)}</p>
                            <p className="mt-1.5 text-[10px] text-slate-400">📍 {factA.source}</p>
                        </div>
                    )}
                    {/* Option B */}
                    {factB && (
                        <div
                            onClick={() => onUpdate({ ...resolution, mode: 'B', winnerFactId: factB.id, custom_input: undefined })}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${resolution?.mode === 'B' ? 'border-amber-500 bg-amber-50 scale-[1.01]' : 'border-slate-200 hover:border-amber-300 bg-slate-50'}`}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-black text-amber-700 uppercase">◈ Adopt Claim B</span>
                                <span className="text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-bold">{getFactIndex(allFacts, factB.id)}</span>
                                {resolution?.mode === 'B' && <FiCheck className="w-3.5 h-3.5 text-amber-600" />}
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">{getContent(factB)}</p>
                            <p className="mt-1.5 text-[10px] text-slate-400">📍 {factB.source}</p>
                        </div>
                    )}
                </div>

                {/* Custom */}
                <div
                    className={`rounded-xl border-2 overflow-hidden transition-all duration-200 ${resolution?.mode === 'custom' ? 'border-purple-400' : 'border-slate-200 hover:border-purple-300'}`}
                    onClick={() => { if (resolution?.mode !== 'custom') onUpdate({ ...resolution, mode: 'custom', winnerFactId: undefined }); }}
                >
                    <div className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${resolution?.mode === 'custom' ? 'bg-purple-50' : 'bg-slate-50'}`}>
                        <FiEdit3 className={`w-3.5 h-3.5 ${resolution?.mode === 'custom' ? 'text-purple-600' : 'text-slate-400'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-wide ${resolution?.mode === 'custom' ? 'text-purple-700' : 'text-slate-500'}`}>Custom Resolution</span>
                        {resolution?.mode === 'custom' && <FiCheck className="ml-auto w-3.5 h-3.5 text-purple-600" />}
                    </div>
                    {resolution?.mode === 'custom' && (
                        <textarea
                            className="w-full px-3 py-2 text-xs text-slate-700 bg-white resize-none focus:outline-none border-t border-slate-100"
                            rows={3}
                            placeholder="Enter your custom resolution..."
                            value={resolution?.custom_input || ''}
                            onChange={e => onUpdate({ ...resolution, custom_input: e.target.value })}
                            onClick={e => e.stopPropagation()}
                        />
                    )}
                </div>

                {/* Reasoning */}
                {resolution?.mode && (
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide block mb-1.5">Reasoning (Required for Audit)</label>
                        <textarea
                            className="w-full px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                            rows={2}
                            placeholder="Document your rationale for audit lineage..."
                            value={resolution?.reasoning || ''}
                            onChange={e => onUpdate({ ...resolution, reasoning: e.target.value })}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function Step4_HITL() {
    const { project, fetchProject, contradictions, facts } = useProject() || {};
    const [resolutions, setResolutions] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showDAG, setShowDAG] = useState(false);

    const localContradictions = contradictions || [];
    const localFacts = facts || [];

    const updateResolution = (cid, data) => setResolutions(prev => ({ ...prev, [cid]: data }));

    const isCardResolved = (c) => {
        const r = resolutions[c.id];
        if (!r || !r.mode || !r.reasoning) return false;
        if (r.mode === 'custom' && !r.custom_input) return false;
        return true;
    };

    const resolvedCount = localContradictions.filter(isCardResolved).length;
    const allResolved = localContradictions.length > 0 && resolvedCount === localContradictions.length;

    const handleSubmitAll = async () => {
        if (!project?.id) return;
        setSubmitting(true);
        try {
            const payload = localContradictions.map(c => {
                const r = resolutions[c.id];
                return {
                    contradictionId: c.id,
                    ...(r.mode !== 'custom' ? { winnerFactId: r.winnerFactId } : { custom_input: r.custom_input }),
                    reasoning: r.reasoning,
                };
            });
            await resolveContradiction(project.id, payload);
            toast.success('All conflicts resolved! Generating BRD...');
            await generateBRD(project.id);
            await fetchProject(project.id);
            toast.success('BRD synthesized successfully!');
        } catch (err) {
            toast.error('Submission failed. Check console.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSkipToBRD = async () => {
        if (!project?.id) return;
        setSubmitting(true);
        try {
            await generateBRD(project.id);
            await fetchProject(project.id);
        } catch (err) {
            toast.error('BRD generation failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
            {/* Header */}
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full mb-4">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest">Stage 4 — HITL Resolution</span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Human-in-the-Loop Console</h2>
                <p className="text-sm text-slate-500 mt-1">Choose the authoritative resolution for each conflict. All decisions are audit-logged with full data lineage.</p>
            </div>

            {/* Progress */}
            {localContradictions.length > 0 && (
                <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-600">Resolution Progress</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-purple-600">{resolvedCount} / {localContradictions.length}</span>
                            {allResolved && (
                                <button
                                    onClick={() => setShowDAG(v => !v)}
                                    className="flex items-center gap-1 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-[10px] font-black uppercase hover:bg-indigo-100 transition-all"
                                >
                                    <FiGitBranch className="w-3 h-3" />
                                    {showDAG ? 'Hide' : 'View'} DAG Trail
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-700"
                            style={{ width: `${localContradictions.length > 0 ? (resolvedCount / localContradictions.length) * 100 : 0}%` }}
                        />
                    </div>
                </div>
            )}

            {/* DAG Summary */}
            {showDAG && allResolved && localContradictions.length > 0 && (
                <DAGSummary
                    contradictions={localContradictions}
                    allFacts={localFacts}
                    resolutions={resolutions}
                />
            )}

            {/* No Contradictions */}
            {localContradictions.length === 0 && (
                <div className="flex flex-col items-center py-16 border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50/30">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                        <FiCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-sm font-bold text-emerald-600">No conflicts to resolve!</p>
                    <p className="text-xs text-emerald-500 mt-1 mb-5">All facts are logically consistent.</p>
                    <button
                        onClick={handleSkipToBRD}
                        disabled={submitting}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
                    >
                        {submitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiArrowRight />}
                        Generate BRD
                    </button>
                </div>
            )}

            {/* HITL Cards */}
            {localContradictions.length > 0 && (
                <div className="space-y-5">
                    {localContradictions.map(c => (
                        <HITLCard
                            key={c.id}
                            contradiction={c}
                            allFacts={localFacts}
                            resolution={resolutions[c.id] || {}}
                            onUpdate={(data) => updateResolution(c.id, data)}
                        />
                    ))}
                </div>
            )}

            {/* Submit CTA */}
            {localContradictions.length > 0 && (
                <div className={`flex items-center justify-between p-6 rounded-2xl shadow-xl transition-all duration-300 ${allResolved ? 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-purple-200' : 'bg-slate-100 shadow-slate-100'}`}>
                    <div>
                        <div className={`font-black text-sm ${allResolved ? 'text-white' : 'text-slate-400'}`}>
                            {allResolved ? 'Submit All Resolutions & Synthesize BRD' : `Resolve all ${localContradictions.length} conflicts to continue`}
                        </div>
                        <div className={`text-xs mt-0.5 ${allResolved ? 'text-purple-200' : 'text-slate-400'}`}>
                            {resolvedCount}/{localContradictions.length} cards completed
                        </div>
                    </div>
                    <button
                        onClick={handleSubmitAll}
                        disabled={!allResolved || submitting}
                        className={`flex items-center gap-2 px-6 py-3 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all ${allResolved ? 'bg-white text-purple-700 hover:bg-purple-50' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} disabled:opacity-50`}
                    >
                        {submitting ? (
                            <><span className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />Synthesizing...</>
                        ) : (
                            <>Synthesize BRD <FiArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
