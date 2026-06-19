import React from 'react';
import { EmailItem } from '@/types/email';
import { AttachmentList } from './AttachmentList';

interface ClassificationCardProps {
  email: EmailItem;
}

export const ClassificationCard: React.FC<ClassificationCardProps> = ({ email }) => {
  const getConfidenceColor = (score: number) => {
    if (score >= 0.90) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score >= 0.50) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-500 border border-red-500/20">🔴 High</span>;
      case 'medium': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-500/20 text-orange-500 border border-orange-500/20">🟠 Medium</span>;
      case 'low': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/20">⚫ Low</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-caldim-panel border border-caldim-border rounded-lg overflow-hidden flex flex-col shadow-lg">
      <div className="p-5 border-b border-caldim-border bg-caldim-dark/80">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 mb-1">{email.subject}</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>From: <span className="text-slate-200">{email.from}</span></span>
              <span>•</span>
              <span>{new Date(email.processedAt).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getPriorityBadge(email.priority)}
            <div className={`px-3 py-1 rounded border font-mono text-xs flex items-center gap-2 ${getConfidenceColor(email.confidence)}`}>
              <span>AI Confidence:</span>
              <span className="font-bold">{(email.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-500">Category Assessed:</span>
          <span className="px-2 py-1 bg-slate-800 text-caldim-accent text-xs rounded uppercase font-bold tracking-wide">
            {email.category ? email.category.replace('_', ' ') : 'UNASSIGNED'}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1">
        <h4 className="text-xs font-semibold text-caldim-accent mb-3 uppercase tracking-wider">Raw Extracted Text</h4>
        <div className="bg-caldim-dark p-4 rounded-lg text-sm text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto font-mono border border-slate-800/50">
          {email.textPlain || 'No plain text body content extracted.'}
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <AttachmentList attachments={email.attachments} emailCategory={email.category || 'unclassified'} />
        )}
      </div>
    </div>
  );
};
