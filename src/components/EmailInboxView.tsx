import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEmails } from '@/hooks/useEmailClassification';
import { useEmailStore } from '@/store/useEmailStore';
import { EMAIL_CATEGORIES } from '@/types/email';
import { exportEmailsToCSV } from '@/utils/csvExport';
import { useTableSort } from '@/hooks/useTableSort';
import { SortableHeader } from '@/components/SortableHeader';

export const EmailInboxView: React.FC = () => {
  const router = useRouter();
  const { data: emails = [], isLoading } = useEmails();
  const getAutomatedEmails = useEmailStore((state) => state.getAutomatedEmails);
  const searchQuery = useEmailStore((state) => state.searchQuery);
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Filter out junk and needs_review emails from Inbox Streams
  const automatedEmails = getAutomatedEmails(emails).filter(e => e.category !== 'junk' && e.category !== 'needs_review');
  
  // Filter by category
  const categoryFiltered = activeCategory === 'all' 
    ? automatedEmails 
    : automatedEmails.filter(e => e.category === activeCategory);

  // Filter by search query
  const filteredEmails = categoryFiltered.filter(email => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return true;
    const haystack = [
      email.from,
      email.subject,
      email.textPlain,
      email.category,
      email.priority
    ].join(' ').toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  const { items: sortedEmails, requestSort, sortConfig } = useTableSort(filteredEmails, 'processedAt', 'desc');

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

  // Filter category list to exclude junk and needs_review for the filter tabs
  const displayCategories = EMAIL_CATEGORIES.filter(cat => cat !== 'junk' && cat !== 'needs_review');

  return (
    <div className="flex flex-col h-full bg-caldim-dark">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-1">Classified Inbox</h2>
          <p className="text-sm text-slate-400">Viewing auto-routed items processed by the AI classification engine.</p>
        </div>
        <button
          onClick={() => exportEmailsToCSV(sortedEmails, 'classified_inbox.csv')}
          disabled={sortedEmails.length === 0}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-caldim-border bg-caldim-panel hover:border-caldim-primary/40 hover:text-caldim-accent transition-all text-caldim-text-muted font-mono text-xxs tracking-widest uppercase shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-caldim-border scrollbar-track-transparent">
        <button 
          onClick={() => setActiveCategory('all')}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors border ${activeCategory === 'all' ? 'bg-caldim-primary border-caldim-primary text-white shadow-[0_0_10px_rgba(13,148,136,0.3)]' : 'bg-caldim-panel border-caldim-border text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        >
          All Streams
        </button>
        {displayCategories.map(cat => (
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
              <SortableHeader label="P" sortKey="priority" currentSort={sortConfig} onRequestSort={requestSort} className="w-12 text-center" align="center" />
              <SortableHeader label="Sender" sortKey="from" currentSort={sortConfig} onRequestSort={requestSort} />
              <SortableHeader label="Subject" sortKey="subject" currentSort={sortConfig} onRequestSort={requestSort} className="w-2/5" />
              <SortableHeader label="Category" sortKey="category" currentSort={sortConfig} onRequestSort={requestSort} />
              <SortableHeader label="Processed" sortKey="processedAt" currentSort={sortConfig} onRequestSort={requestSort} />
              <SortableHeader label="Confidence" sortKey="confidence" currentSort={sortConfig} onRequestSort={requestSort} align="right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-caldim-border/50">
            {sortedEmails.map(email => (
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
                  {new Date(email.processedAt).toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs">
                  <span className={`px-2 py-1 border rounded ${getConfidenceColor(email.confidence)}`}>
                    {(email.confidence * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))}
            {sortedEmails.length === 0 && (
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
