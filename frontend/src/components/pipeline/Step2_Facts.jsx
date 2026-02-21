import React, { useState } from 'react';
import {
    FiZap, FiArrowRight, FiDatabase, FiTag,
    FiClock, FiTrash2, FiCheck, FiAlertCircle, FiCpu
} from 'react-icons/fi';
import { useAuth } from '../providers/AuthProvider';
import { useProject } from '../providers/ProjectProvider';
import { mapFacts, deleteFact, increamentProjectStatus } from '../../apis/api';
import { toast } from 'sonner';

// ─── TONE COLOURS ─────────────────────────────────────────────────────────────

const TONE_STYLE = {
    Positive: 'bg-emerald-100 text-emerald-700',
    Negative: 'bg-rose-100 text-rose-700',
    Neutral: 'bg-slate-100 text-slate-600',
    Urgent: 'bg-amber-100 text-amber-700',
    Skeptical: 'bg-purple-100 text-purple-700',
    Formal: 'bg-indigo-100 text-indigo-700',
};

const SRC_STYLE = {
    messaging: 'bg-indigo-50 border-indigo-200 text-indigo-600',
    file: 'bg-amber-50 border-amber-200 text-amber-700',
};

// ─── FACT CARD ─────────────────────────────────────────────────────────────────

function FactCard({ fact, idx, onDelete, deleting }) {
    const content =
        typeof fact.content === 'object'
            ? (fact.content?.statement || JSON.stringify(fact.content))
            : String(fact.content);

    const toneStyle = TONE_STYLE[fact.tone] || TONE_STYLE.Neutral;
    const srcStyle = SRC_STYLE[fact.sourceType] || SRC_STYLE.messaging;

    return (
        <div className="group flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all duration-200">
            {/* Index */}
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-[11px] font-black text-slate-400">
                {String(idx + 1).padStart(2, '0')}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 font-medium leading-relaxed">{content}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {/* Source */}
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${srcStyle}`}>
                        <FiDatabase className="w-2.5 h-2.5" /> {fact.source}
                    </span>
                    {/* Tone */}
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${toneStyle}`}>
                        <FiTag className="w-2.5 h-2.5" /> {fact.tone}
                    </span>
                    {/* Source type */}
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                        {fact.sourceType === 'file' ? '📄' : '💬'} {fact.sourceType}
                    </span>
                    {/* Date */}
                    {fact.when && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <FiClock className="w-2.5 h-2.5" />
                            {new Date(fact.when).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    )}
                </div>
            </div>

            {/* Delete button */}
            <button
                onClick={() => onDelete(fact.id)}
                disabled={deleting === fact.id}
                title="Remove this fact"
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
            >
                {deleting === fact.id
                    ? <span className="w-3.5 h-3.5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                    : <FiTrash2 className="w-3.5 h-3.5" />}
            </button>
        </div>
    );
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────

export default function Step2_Facts() {
    const { testUser } = useAuth();
    const { project, fetchProject, facts, setFacts } = useProject() || {};

    // Track whether extraction has been run at least once this session
    const [extracted, setExtracted] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [advancing, setAdvancing] = useState(false);

    const localFacts = facts || [];

    // ── Extract (run once) ────────────────────────────────────────────────────

    const handleExtract = async () => {
        if (!project?.id || !testUser) return toast.error('Missing project or user data');
        setExtracting(true);
        try {
            const res = await mapFacts(project.id, testUser);
            const saved =
                res?.data?.savedFacts ||
                res?.savedFacts ||
                [];
            if (setFacts) setFacts(saved);
            setExtracted(true);
            toast.success(`${saved.length} atomic facts extracted!`);
        } catch {
            // toast shown by api.js
        } finally {
            setExtracting(false);
        }
    };

    // ── Delete single fact ────────────────────────────────────────────────────

    const handleDelete = async (factId) => {
        if (!project?.id) return;
        setDeletingId(factId);
        try {
            await deleteFact(project.id, factId);
            if (setFacts) setFacts(prev => prev.filter(f => f.id !== factId));
        } catch {
            // toast shown by api.js
        } finally {
            setDeletingId(null);
        }
    };

    // ── Advance ───────────────────────────────────────────────────────────────

    const handleAdvance = async () => {
        if (!project?.id) return;
        if (localFacts.length === 0) return toast.error('No facts to carry forward — extract at least one first');
        setAdvancing(true);
        try {
            await increamentProjectStatus(project.id);
            await fetchProject(project.id);
            toast.success('Moving to DAG Conflict Detection →');
        } catch {
            toast.error('Failed to advance');
        } finally {
            setAdvancing(false);
        }
    };

    // ── States: Initial / Extracting / Results ───────────────────────────────

    const showInitial = !extracted && !extracting && localFacts.length === 0;
    const showLoading = extracting;
    const showResults = (extracted || localFacts.length > 0) && !extracting;

    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

            {/* Header */}
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full mb-4">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Stage 2 — Atomic Fact Extraction</span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Neural FactID Sequence</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Decompose every communication stream into independent, verifiable atomic claims.
                </p>
            </div>

            {/* ── INITIAL — big CTA ── */}
            {showInitial && (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-amber-200 rounded-2xl bg-amber-50/30 fade-up">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-amber-200 flex items-center justify-center mb-6">
                        <FiCpu className="w-9 h-9 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">Ready to Extract Atomic Facts</h3>
                    <p className="text-sm text-slate-500 text-center max-w-sm mb-8">
                        Anvaya will analyse all selected communications and uploaded files, then decompose each message into verifiable, source-cited atomic claims.
                    </p>
                    <button
                        onClick={handleExtract}
                        className="flex items-center gap-3 px-10 py-4 bg-amber-500 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-amber-200 hover:bg-amber-600 transition-all active:scale-[0.98]"
                    >
                        <FiZap className="w-5 h-5" />
                        Start Extracting Atomic Facts
                    </button>
                </div>
            )}

            {/* ── LOADING ── */}
            {showLoading && (
                <div className="flex flex-col items-center py-24">
                    <div className="relative w-16 h-16 mb-6">
                        <div className="absolute inset-0 border-4 border-amber-200 rounded-full animate-ping opacity-40" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    </div>
                    <p className="text-base font-black text-slate-600">Anvaya is decomposing communications…</p>
                    <p className="text-sm text-slate-400 mt-1">Analysing messages, emails, meetings and files. This may take 15–30 seconds.</p>
                </div>
            )}

            {/* ── RESULTS ── */}
            {showResults && (
                <>
                    {/* Stats bar */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="text-2xl font-black text-slate-800">{localFacts.length}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Facts</div>
                        </div>
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl shadow-sm">
                            <div className="text-2xl font-black text-emerald-600">{localFacts.filter(f => f.resolved).length}</div>
                            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Active</div>
                        </div>
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl shadow-sm">
                            <div className="text-2xl font-black text-amber-600">{localFacts.filter(f => f.sourceType === 'file').length}</div>
                            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">From Files</div>
                        </div>
                    </div>

                    {/* Tip */}
                    <div className="flex items-start gap-2.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <FiAlertCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-500 font-medium">
                            Hover over any fact and click <span className="text-rose-500 font-bold">🗑</span> to remove it before proceeding. Deleted facts will not appear in the BRD.
                        </p>
                    </div>

                    {/* Fact list */}
                    {localFacts.length > 0 ? (
                        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
                            {localFacts.map((f, i) => (
                                <FactCard
                                    key={f.id || i}
                                    fact={f}
                                    idx={i}
                                    onDelete={handleDelete}
                                    deleting={deletingId}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                            <FiCheck className="w-10 h-10 text-slate-300 mb-2" />
                            <p className="text-sm font-bold text-slate-400">All facts deleted</p>
                            <p className="text-xs text-slate-400 mt-1">No facts to carry forward. You can still proceed — conflicts detection will have nothing to scan.</p>
                        </div>
                    )}

                    {/* Proceed CTA */}
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl shadow-xl shadow-amber-200">
                        <div>
                            <div className="text-white font-black text-sm">Proceed to Conflict Detection</div>
                            <div className="text-amber-100 text-xs mt-0.5">
                                {localFacts.length} fact{localFacts.length !== 1 ? 's' : ''} will be carried into the DAG analysis
                            </div>
                        </div>
                        <button
                            onClick={handleAdvance}
                            disabled={advancing}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-amber-700 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-amber-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {advancing ? (
                                <><span className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />Advancing…</>
                            ) : (
                                <>Detect Conflicts <FiArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
