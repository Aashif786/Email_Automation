import React from 'react';
import { EmailAttachment } from '@/types/email';

interface AttachmentListProps {
  attachments: EmailAttachment[];
  emailCategory: string;
}

export const AttachmentList: React.FC<AttachmentListProps> = ({ attachments, emailCategory }) => {
  if (!attachments || attachments.length === 0) return null;

  const handleDownload = (fileName: string) => {
    const API_BASE_URL = process.env.REACT_APP_N8N_WEBHOOK_URL || '/api';
    const downloadUrl = `${API_BASE_URL}/attachments/${encodeURIComponent(fileName)}`;
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return '📄';
    if (['png', 'jpg', 'jpeg', 'gif'].includes(ext || '')) return '🖼️';
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return '📊';
    return '📎';
  };

  return (
    <div className="mt-4">
      <h4 className="text-xs font-semibold text-caldim-accent mb-2 uppercase tracking-wider">Attachments ({attachments.length})</h4>
      <div className="flex flex-col gap-2">
        {attachments.map((att, idx) => (
          <div key={idx} className="flex items-center justify-between bg-caldim-dark border border-caldim-border px-4 py-2 rounded">
            <div className="flex items-center gap-3">
              <span className="text-xl">{getFileIcon(att.fileName)}</span>
              <div>
                <p className="text-sm font-medium text-slate-200">{att.fileName}</p>
                <p className="text-xxs text-slate-500 uppercase">{att.contentType || 'Unknown Type'}</p>
              </div>
            </div>
            <button 
              onClick={() => handleDownload(att.fileName)}
              className="px-3 py-1 bg-caldim-primary/10 hover:bg-caldim-primary/20 text-caldim-accent border border-caldim-primary/30 rounded text-xs transition-colors"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
