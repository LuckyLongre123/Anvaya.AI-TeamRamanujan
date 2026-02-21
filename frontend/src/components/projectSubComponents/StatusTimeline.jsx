import React from 'react';
import { useProject } from '../../components/providers/ProjectProvider';

export default function StatusTimeline({ status: propStatus }) {
  const { project } = useProject() || {};
  const status = typeof propStatus === 'number' ? propStatus : (project?.status ?? 0);
  const steps = [0, 1, 2, 3, 4, 5];
  const labels = ['selection', 'stackholders', 'facts', 'conflicts', 'Final summary', 'refine and export'];

  return (
    <div className="w-full px-2">
      <div className="flex items-center justify-between gap-2">
        {steps.map((s, i) => {
          const done = s <= status;
          const isCurrent = s === status;
          return (
            <div key={s} className="flex-1 text-center">
              <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>
                {s}
              </div>
              <div className={`mt-1 text-[10px] ${isCurrent ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>{labels[i]}</div>
            </div>
          );
        })}
      </div>
      <div className="relative mt-2 h-1 bg-slate-100 rounded-full">
        <div style={{ width: `${(Math.max(0, Math.min(status, 5)) / 5) * 100}%` }} className="absolute left-0 top-0 h-1 bg-indigo-500 rounded-full" />
      </div>
    </div>
  );
}
