import React from 'react';
import { useEmails } from '@/hooks/useEmailClassification';
import { useEmailStore } from '@/store/useEmailStore';

export const DashboardSummary: React.FC = () => {
  const { data: emails = [], isLoading } = useEmails();
  const getCounts = useEmailStore(state => state.getCounts);
  const counts = getCounts(emails);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-8 text-slate-400 animate-pulse font-mono tracking-widest text-sm">
          SYNCHRONIZING DATA STREAMS...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-slate-100 mb-2 tracking-wide uppercase">System Analytics Overview</h2>
        <p className="text-slate-400 text-sm">Real-time throughput and processing metrics from the Caldim Digital Postmaster.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-caldim-panel p-6 rounded-lg border border-caldim-border relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 left-0 w-1 h-full bg-slate-500"></div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Processed</h3>
          <p className="text-5xl font-black text-slate-200 group-hover:scale-105 transition-transform origin-left">{counts.total}</p>
        </div>
        
        <div className="bg-caldim-panel p-6 rounded-lg border border-caldim-border relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Auto-Routed</h3>
          <p className="text-5xl font-black text-emerald-400 group-hover:scale-105 transition-transform origin-left">{counts.autoRouted}</p>
        </div>
        
        <div className="bg-caldim-panel p-6 rounded-lg border border-caldim-border relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Pending Triage</h3>
          <p className="text-5xl font-black text-red-400 group-hover:scale-105 transition-transform origin-left">{counts.manualReview}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Throughput by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(counts.byCategory).map(([cat, count]) => (
            <div key={cat} className="bg-caldim-panel p-4 rounded-lg border border-caldim-border flex justify-between items-center group hover:border-caldim-primary/50 transition-colors">
              <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider truncate mr-2 group-hover:text-caldim-accent transition-colors">{cat.replace('_', ' ')}</span>
              <span className="text-2xl font-black text-slate-200">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
