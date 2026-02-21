import React from 'react';
import { FiCpu, FiShield } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/60 bg-white/70 backdrop-blur-md py-6 transition-all duration-300">
      <div className="max-w-300 mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Mission */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-50 rounded-lg border border-indigo-100">
            <FiCpu className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-black text-slate-800 uppercase tracking-widest">
              Anvaya Logic Engine
            </span>
            <span className="block text-[10px] text-slate-400 font-medium">
              Deterministic BRD Synthesis v1.0
            </span>
          </div>
        </div>

        {/* Copyright & Links */}
        <div className="text-center md:text-right">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
            © {new Date().getFullYear()} Team Ramanujan — HackFest 2.0
          </p>
          <div className="flex items-center justify-center md:justify-end gap-4 mt-1.5">
            <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-black uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              <FiShield className="w-2.5 h-2.5" />
              Source Verified
            </div>
            <span className="text-[10px] text-slate-300 font-mono italic">
              "Logic-First Requirements"
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}