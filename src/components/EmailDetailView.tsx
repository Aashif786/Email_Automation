import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEmails } from '@/hooks/useEmailClassification';
import { ClassificationCard } from './ClassificationCard';

export const EmailDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: emails = [], isLoading } = useEmails();
  
  const email = emails.find(e => e.id === id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="p-8 text-slate-400 animate-pulse font-mono tracking-widest text-sm">
          RETRIEVING RECORD...
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-red-400 p-6 mb-4 font-mono text-lg border border-red-500/20 bg-red-500/10 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          RECORD NOT FOUND IN MEMORY
        </div>
        <button 
          onClick={() => router.push('/inbox')}
          className="text-sm px-4 py-2 bg-caldim-panel border border-caldim-border hover:bg-caldim-primary hover:text-white transition-colors uppercase tracking-wider font-semibold rounded"
        >
          Return to Inbox Streams
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div>
        <button 
          onClick={() => router.back()}
          className="text-xs font-semibold text-caldim-primary hover:text-caldim-accent flex items-center gap-2 transition-colors mb-4 uppercase tracking-wider"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Stream
        </button>
      </div>
      <ClassificationCard email={email} />
    </div>
  );
};
