import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEmails } from '@/hooks/useEmailClassification';
import { useEmailStore } from '@/store/useEmailStore';
import { EMAIL_CATEGORIES } from '@/types/email';

export const EmailInboxView: React.FC = () => {
  const router = useRouter();
  const { data: emails = [], isLoading } = useEmails();
  const getAutomatedEmails = useEmailStore((state) => state.getAutomatedEmails);
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const automatedEmails = getAutomatedEmails(emails);
  const filteredEmails = activeCategory === 'all' 
    ? automatedEmails 
    : automatedEmails.filter(e => e.category === activeCategory);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-[0_0_8px_rgba(239,68,68,0.8)]" title="High Priority"></span>;
      case 'medium': return <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block shadow-[0_0_8px_rgba(249,115,22,0.8)]" title="Medium Priority"></span>;
      case 'low': return <span className="w-2.5 h-2.5 rounded-full bg-gray-500 inline-block" title="Low Priority"></span>;
      default: return null;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.90) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (score >= 0.50) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
  };

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
    <div className="flex flex-col h-full bg-caldim-dark">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100 mb-1">Classified Inbox</h2>
        <p className="text-sm text-slate-400">Viewing auto-routed items processed by the n8n engine.</p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-caldim-border scrollbar-track-transparent">
        <button 
          onClick={() => setActiveCategory('all')}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border ${activeCategory === 'all' ? 'bg-caldim-primary border-caldim-primary text-white shadow-[0_0_10px_rgba(13,148,136,0.3)]' : 'bg-caldim-panel border-caldim-border text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        >
          All Streams
        </button>
        {EMAIL_CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border ${activeCategory === cat ? 'bg-caldim-primary border-caldim-primary text-white shadow-[0_0_10px_rgba(13,148,136,0.3)]' : 'bg-caldim-panel border-caldim-border text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-caldim-panel rounded-lg border border-caldim-border shadow-lg">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-caldim-dark/80 text-xs uppercase text-slate-500 font-semibold tracking-wider sticky top-0 backdrop-blur-sm z-10">
            <tr>
              <th className="px-4 py-4 w-12 border-b border-caldim-border"></th>
              <th className="px-4 py-4 border-b border-caldim-border">Sender</th>
              <th className="px-4 py-4 border-b border-caldim-border w-2/5">Subject</th>
              <th className="px-4 py-4 border-b border-caldim-border">Category</th>
              <th className="px-4 py-4 border-b border-caldim-border">Processed</th>
              <th className="px-4 py-4 border-b border-caldim-border text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-caldim-border/50">
            {filteredEmails.map(email => (
              <tr 
                key={email.id} 
                onClick={() => router.push(`/email/${email.id}`)}
                className="hover:bg-slate-800/80 cursor-pointer transition-all group"
              >
                <td className="px-4 py-3 text-center">{getPriorityBadge(email.priority)}</td>
                <td className="px-4 py-3 truncate max-w-[200px] text-slate-300 group-hover:text-slate-100 transition-colors">{email.from}</td>
                <td className="px-4 py-3 truncate max-w-[300px] text-slate-200 font-medium group-hover:text-white transition-colors">{email.subject}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-slate-900/80 border border-slate-700/50 rounded text-xxs uppercase tracking-wider text-caldim-accent">
                    {email.category?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                  {new Date(email.processedAt).toLocaleString(undefined, { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs">
                  <span className={`px-2 py-1 border rounded ${getConfidenceColor(email.confidence)}`}>
                    {(email.confidence * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))}
            {filteredEmails.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-500 font-mono text-sm">
                  NO CLASSIFIED EMAILS FOUND FOR THIS STREAM
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
