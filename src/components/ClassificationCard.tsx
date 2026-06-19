'use client';

import React, { useState } from 'react';
import { EmailItem, EMAIL_CATEGORIES, CATEGORY_LABELS, EmailCategory, EmailPriority } from '@/types/email';
import { AttachmentList } from './AttachmentList';
import { useReclassifyEmail } from '@/hooks/useEmailClassification';

interface ClassificationCardProps {
  email: EmailItem;
}

const PRIORITY_OPTIONS: EmailPriority[] = ['high', 'medium', 'low'];

export const ClassificationCard: React.FC<ClassificationCardProps> = ({ email }) => {
  const [showReclassify, setShowReclassify] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EmailCategory>(
    (EMAIL_CATEGORIES.includes(email.category as EmailCategory) ? email.category : 'general') as EmailCategory
  );
  const [selectedPriority, setSelectedPriority] = useState<EmailPriority>(email.priority || 'medium');
  const reclassifyMutation = useReclassifyEmail();

  const handleReclassify = () => {
    reclassifyMutation.mutate(
      { emailId: email.id, category: selectedCategory, priority: selectedPriority },
      { onSuccess: () => setShowReclassify(false) }
    );
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.90) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score >= 0.65) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (score >= 0.50) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':   return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">🔴 High</span>;
      case 'medium': return <span className="px-2 py-0.5 rounded text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">🟠 Medium</span>;
      case 'low':    return <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">⚫ Low</span>;
      default:       return null;
    }
  };

  const isReclassified = email.status === 'manually_reclassified' && !!email.originalCategory;

  return (
    <div className="bg-caldim-panel border border-caldim-border rounded-lg overflow-hidden flex flex-col shadow-lg">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="p-5 border-b border-caldim-border bg-caldim-dark/80">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl font-bold text-slate-100 mb-1 break-words">{email.subject}</h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <span>From: <span className="text-slate-200">{email.from}</span></span>
              <span>•</span>
              <span>{new Date(email.processedAt).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {getPriorityBadge(email.priority)}
            <div className={`px-3 py-1 rounded border font-mono text-xs flex items-center gap-2 ${getConfidenceColor(email.confidence)}`}>
              <span>AI Confidence:</span>
              <span className="font-bold">{(email.confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Category row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-slate-500">Category:</span>
          <span className="px-2 py-1 bg-slate-800 text-caldim-accent text-xs rounded uppercase font-bold tracking-wide">
            {email.category ? CATEGORY_LABELS[email.category as EmailCategory] || email.category.replace(/_/g, ' ') : 'UNASSIGNED'}
          </span>
          <button
            onClick={() => setShowReclassify(!showReclassify)}
            className="ml-auto px-3 py-1 text-xs rounded border border-caldim-border bg-caldim-dark hover:border-caldim-primary hover:text-caldim-accent text-slate-400 transition-all font-mono uppercase tracking-wider"
          >
            {showReclassify ? 'Cancel' : '✏ Reclassify'}
          </button>
        </div>

        {/* Audit trail badge — shows if the email was manually reclassified */}
        {isReclassified && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-300 flex flex-wrap gap-x-4 gap-y-1">
            <span>📋 AUDIT TRAIL</span>
            <span>Original AI Category: <span className="text-blue-200 font-bold uppercase">{email.originalCategory?.replace(/_/g, ' ')}</span></span>
            <span>→ Reclassified to: <span className="text-caldim-accent font-bold uppercase">{email.category?.replace(/_/g, ' ')}</span></span>
            {email.reclassifiedAt && (
              <span>by <span className="text-blue-200">{email.reclassifiedBy || 'user'}</span> at {new Date(email.reclassifiedAt).toLocaleString()}</span>
            )}
          </div>
        )}

        {/* Reclassification panel */}
        {showReclassify && (
          <div className="mt-4 p-4 bg-caldim-dark rounded-lg border border-caldim-primary/30 space-y-4">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Manual Override</p>

            <div>
              <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider">New Category</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {EMAIL_CATEGORIES.filter(c => c !== 'needs_review').map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 text-xs rounded border text-left truncate transition-colors ${
                      selectedCategory === cat
                        ? 'bg-caldim-primary/20 border-caldim-primary text-caldim-accent font-bold'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider">Priority Override</label>
              <div className="flex gap-2">
                {PRIORITY_OPTIONS.map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPriority(p)}
                    className={`px-4 py-1.5 rounded text-xs capitalize border transition-colors ${
                      selectedPriority === p
                        ? p === 'high'   ? 'bg-red-500/20 border-red-500 text-red-400'
                        : p === 'medium' ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                                         : 'bg-slate-500/20 border-slate-500 text-slate-300'
                        : 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-500'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleReclassify}
              disabled={reclassifyMutation.isPending}
              className="w-full py-2 rounded bg-caldim-primary hover:bg-teal-600 text-white text-sm font-bold transition-colors disabled:opacity-50 uppercase tracking-wider"
            >
              {reclassifyMutation.isPending ? 'Saving...' : 'Confirm Reclassification'}
            </button>
          </div>
        )}
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="p-5 flex-1 space-y-4">

        {/* AI Reasoning */}
        {email.reasoning && (
          <div>
            <h4 className="text-xs font-semibold text-caldim-accent mb-2 uppercase tracking-wider">AI Classification Reasoning</h4>
            <p className="text-sm text-slate-300 italic bg-caldim-dark/60 px-4 py-3 rounded border border-slate-800/60">
              "{email.reasoning}"
            </p>
          </div>
        )}

        {/* Evidence chips */}
        {email.evidence && email.evidence.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-caldim-accent mb-2 uppercase tracking-wider">Key Evidence</h4>
            <div className="flex flex-wrap gap-2">
              {email.evidence.map((e, i) => (
                <span key={i} className="px-2 py-1 bg-caldim-primary/10 border border-caldim-primary/30 text-caldim-accent text-xs rounded font-mono">
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Raw text */}
        <div>
          <h4 className="text-xs font-semibold text-caldim-accent mb-2 uppercase tracking-wider">Raw Extracted Text</h4>
          <div className="bg-caldim-dark p-4 rounded-lg text-sm text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto font-mono border border-slate-800/50">
            {email.textPlain || 'No plain text body content extracted.'}
          </div>
        </div>

        {/* Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <AttachmentList attachments={email.attachments} emailCategory={email.category || 'unclassified'} />
        )}
      </div>
    </div>
  );
};
