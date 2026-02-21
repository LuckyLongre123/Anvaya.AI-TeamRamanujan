import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiUsers, FiCpu, FiGitBranch,
  FiUserCheck, FiShield, FiZap, FiLayers
} from 'react-icons/fi';

// ─── DATA ────────────────────────────────────────────────────────────────────

const PIPELINE_STEPS = [
  {
    num: '01',
    title: 'Stakeholder Mapping',
    desc: 'Identifies organisational hierarchy, influence tiers, and authority flow from multi-channel communications.',
    icon: FiUsers,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
  {
    num: '02',
    title: 'Contextual Extraction',
    desc: 'Decomposes every message into Atomic Facts with deep-linked citations back to original sources.',
    icon: FiCpu,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    num: '03',
    title: 'DAG Conflict Detection',
    desc: 'A Directed Acyclic Graph engine scans the fact set to surface Requirement Drift across stakeholders.',
    icon: FiGitBranch,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
  },
  {
    num: '04',
    title: 'HITL Resolution',
    desc: 'Human-in-the-Loop cards let reviewers choose the authoritative claim — every decision audit-logged.',
    icon: FiUserCheck,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    num: '05',
    title: 'Truth Synthesis',
    desc: 'Generates an audit-ready BRD where every clause is traceable back to its verified original source.',
    icon: FiShield,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
];

const CHANNELS = [
  { label: 'Enron Emails', emoji: '📧', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { label: 'AMI Transcripts', emoji: '🎙️', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { label: 'Slack Logs', emoji: '💬', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { label: 'WhatsApp', emoji: '📱', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { label: 'Meeting Notes', emoji: '📋', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { label: 'Gmail', emoji: '✉️', color: 'bg-slate-50 border-slate-200 text-slate-600' },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function NavBar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-16 glass border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <FiLayers className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-black text-slate-900 tracking-tight">Anvaya</span>
            <span className="text-sm font-black text-indigo-600 tracking-tight">.Ai</span>
          </div>
        </div>

        {/* Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Logic-First Requirements Engine</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors px-3 py-1.5">
            Sign In
          </Link>
          <Link to="/signup" className="flex items-center gap-1.5 btn-primary py-2! px-4! rounded-xl!">
            Get Started <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-[10%] w-130 h-130 bg-indigo-500/8 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-[5%] w-100 h-100 bg-rose-500/6 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-purple-500/5 blur-[80px] rounded-full" />
        {/* Blueprint grid */}
        <div className="absolute inset-0 bg-blueprint" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center fade-up">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-full mb-10 shadow-sm">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Source-of-Truth Reconciliation Engine</span>
            <span className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black rounded-full uppercase tracking-wide">New</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.03] tracking-tight mb-8">
            End Requirement<br />Drift.{' '}
            <span className="gradient-text">Forever.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
            Anvaya.Ai ingests fragmented business communications — emails, Slack, meetings, WhatsApp — and transforms them into a{' '}
            <strong className="text-slate-700">verified, audit-ready BRD</strong> with deterministic, 5-stage AI logic.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="flex items-center gap-2.5 px-8 py-4 bg-indigo-600 text-white font-black text-sm rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200/60 active:scale-[0.98]"
            >
              Launch Workspace <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 font-black text-sm rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
            >
              Member Login
            </Link>
          </div>

          {/* Channel chips */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-2">Ingests from:</span>
            {CHANNELS.map(ch => (
              <div key={ch.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${ch.color}`}>
                <span>{ch.emoji}</span>
                {ch.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PipelineSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full mb-5">
            <FiZap className="w-3 h-3 text-indigo-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deterministic Pipeline</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">5-Stage Logic Engine</h2>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
            Unlike AI summarisers, Anvaya runs a deterministic, reproducible pipeline — every stage is auditable, every output grounded in evidence.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PIPELINE_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className={`relative group bg-white border ${step.border} rounded-2xl p-5 card-hover shadow-sm`}>
                {/* Step number */}
                <div className="absolute -top-3 left-5 px-2 py-0.5 bg-white border border-slate-200 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {step.num}
                </div>
                {/* Connector (not last) */}
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-0.5 bg-slate-200 z-10">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-300 rotate-45" />
                  </div>
                )}
                <div className={`w-11 h-11 ${step.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <h3 className="text-sm font-black text-slate-800 mb-2 leading-tight">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProvSection() {
  const points = [
    { title: 'Data Lineage, Not Generation', desc: 'Every BRD clause links to the original message, speaker, and timestamp — not a hallucination.' },
    { title: 'Conflict-Aware', desc: 'DAG engine detects when the CEO says one thing and the CFO another — and forces resolution before synthesis.' },
    { title: 'Audit-Ready Output', desc: 'Exported BRDs carry FACT-ID citations, resolution logs, and stakeholder authority matrices.' },
    { title: 'Human-in-the-Loop', desc: 'No decision is made without human sign-off. Anvaya assists, auditors decide.' },
  ];

  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-900/50 border border-indigo-700/50 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Why Anvaya</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-6 leading-tight">
              90% of documentation errors come from{' '}
              <span className="gradient-text">inconsistent stakeholder feedback.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Anvaya.Ai is purpose-built for the documentation crisis hidden inside every growing organisation — the gap between what was said, what was heard, and what ended up in the spec.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {points.map((p, i) => (
              <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/8 transition-all">
                <div className="w-8 h-8 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-3">
                  <span className="text-indigo-400 text-sm font-black">0{i + 1}</span>
                </div>
                <h4 className="text-sm font-black text-white mb-2">{p.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="relative bg-white anvaya-border-glow rounded-3xl p-14 shadow-xl shadow-indigo-100/40">
          {/* Bg grid */}
          <div className="absolute inset-0 bg-blueprint rounded-3xl" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-200 float">
              <FiShield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-5">
              Ready to eliminate Requirement Drift?
            </h2>
            <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto">
              Create your first Anvaya workspace and run the full 5-stage pipeline in minutes.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/signup" className="flex items-center gap-2 px-10 py-4 bg-indigo-600 text-white font-black text-sm rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-[0.98]">
                Launch Workspace <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="flex items-center gap-2 px-10 py-4 bg-white border border-slate-200 text-slate-700 font-black text-sm rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
            <FiLayers className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-black text-slate-700">Anvaya<span className="text-indigo-600">.Ai</span></span>
        </div>
        <p className="text-xs text-slate-400 font-medium">© 2026 Anvaya.Ai · Source-of-Truth BRD Engine · Powered by Google Gemini</p>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wide">Engine Online</span>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <NavBar />
      <HeroSection />
      <PipelineSection />
      <ProvSection />
      <CTASection />
      <Footer />
    </div>
  );
}