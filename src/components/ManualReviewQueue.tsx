import React, { useState } from 'react';
import { useEmailStore } from '@/store/useEmailStore';
import { useEmails, useReclassifyEmail } from '@/hooks/useEmailClassification';
import { EMAIL_CATEGORIES, EmailCategory, EmailItem, EmailPriority } from '@/types/email';

export const ManualReviewQueue: React.FC = () => {
  const { data: emails = [], isLoading, isError } = useEmails();
  const getManualReviewQueue = useEmailStore((state) => state.getManualReviewQueue);
  const reviewQueue = getManualReviewQueue(emails);

  if (isLoading) {
    return <div className="p-8 text-slate-400">Loading review queue...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-400">Error loading data stream.</div>;
  }

  if (reviewQueue.length === 0) {
    return <div className="p-8 text-emerald-400">No emails pending manual review.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-caldim-border pb-4">
        <h2 className="text-xl font-bold text-slate-100">Manual Review Queue</h2>
        <p className="text-sm text-slate-400">{reviewQueue.length} items flagged for human verification.</p>
      </div>
      <div className="flex flex-col gap-4">
        {reviewQueue.map((email) => (
          <ManualReviewCard key={email.id} email={email} />
        ))}
      </div>
    </div>
  );
};

const ManualReviewCard: React.FC<{ email: EmailItem }> = ({ email }) => {
  const reclassifyMutation = useReclassifyEmail();
  const [selectedPriority, setSelectedPriority] = useState<EmailPriority>(email.priority || 'medium');

  const priorities: EmailPriority[] = ['high', 'medium', 'low'];

  const handleReclassify = (cat: EmailCategory) => {
    reclassifyMutation.mutate({ emailId: email.id, category: cat, priority: selectedPriority });
  };

  return (
    <div className="border border-caldim-border bg-caldim-panel rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b border-caldim-border bg-caldim-dark/50">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{email.subject}</h3>
            <p className="text-sm text-slate-400">From: <span className="text-slate-300">{email.from}</span></p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded border border-yellow-500/20">
              Score: {(email.confidence * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-1">
        <h4 className="text-xs font-semibold text-caldim-accent mb-2 uppercase tracking-wider">Raw Text</h4>
        <div className="bg-caldim-dark p-3 rounded text-sm text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto font-mono">
          {email.textPlain || 'No plain text available.'}
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-caldim-accent mb-2 uppercase tracking-wider">Attachments</h4>
            <div className="flex flex-wrap gap-2">
              {email.attachments.map((att, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded text-sm text-slate-200">
                  <svg className="w-4 h-4 text-caldim-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                  <span className="truncate max-w-[200px]">{att.fileName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-caldim-border bg-slate-900/50">
        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-400 block mb-2 uppercase tracking-wider">Assign Priority</span>
          <div className="flex gap-2">
            {priorities.map(p => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`px-3 py-1 rounded text-xs capitalize border transition-colors ${
                  selectedPriority === p
                    ? p === 'high' ? 'bg-red-500/20 border-red-500 text-red-400' 
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

        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-2 uppercase tracking-wider">Force Category</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {EMAIL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleReclassify(cat)}
                disabled={reclassifyMutation.isPending}
                className="px-3 py-2 text-xs bg-slate-800 hover:bg-caldim-primary active:bg-teal-700 text-slate-200 rounded border border-slate-700 transition-colors text-left truncate disabled:opacity-50"
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
