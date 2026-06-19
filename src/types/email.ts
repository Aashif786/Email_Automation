export const CONFIDENCE_THRESHOLD = 0.65 as const;
export const NEEDS_REVIEW_THRESHOLD = 0.50 as const;

export const EMAIL_CATEGORIES = [
  'project_proposal',
  'feedback_complaint',
  'invoice_payment',
  'job_application',
  'vendor_inquiry',
  'vendor_quote',
  'general',
  'junk',
  'support_request',
  'needs_review',
] as const;

export type EmailCategory = (typeof EMAIL_CATEGORIES)[number];

export type EmailPriority = 'high' | 'medium' | 'low';

export type EmailStatus = 'classified' | 'unclassified' | 'manually_reclassified';

export interface EmailAttachment {
  fileName: string;
  contentType?: string;
  binaryKey: string;
}

export interface EmailItem {
  id: string;
  messageId?: string;
  from: string;
  subject: string;
  textPlain: string;
  category: EmailCategory | '';
  confidence: number;
  priority: EmailPriority;
  processedAt: string;
  status: EmailStatus;
  attachments: EmailAttachment[];
  // AI reasoning (from classification)
  reasoning?: string;
  evidence?: string[];
  // Audit trail (from manual reclassification)
  originalCategory?: string;
  reclassifiedAt?: string;
  reclassifiedBy?: string;
}

export type CategoryCountMap = Record<EmailCategory, number>;

export interface EmailQueueCounts {
  total: number;
  autoRouted: number;
  manualReview: number;
  byCategory: CategoryCountMap;
}

export function isClassifiedEmail(email: EmailItem): boolean {
  if (email.status === 'classified' || email.status === 'manually_reclassified') {
    return true;
  }
  if (email.status === 'unclassified') {
    return false;
  }
  return email.confidence >= CONFIDENCE_THRESHOLD;
}

export function isManualReviewEmail(email: EmailItem): boolean {
  return email.status === 'unclassified' || email.confidence < CONFIDENCE_THRESHOLD;
}

export function isAutoRoutedEmail(email: EmailItem): boolean {
  return email.status === 'classified' || email.status === 'manually_reclassified' || email.confidence >= CONFIDENCE_THRESHOLD;
}

export function getConfidenceBracket(
  confidence: number
): 'high' | 'moderate' | 'low' {
  if (confidence >= 0.9) {
    return 'high';
  }
  if (confidence >= 0.5) {
    return 'moderate';
  }
  return 'low';
}

export function createEmptyCategoryCounts(): CategoryCountMap {
  return EMAIL_CATEGORIES.reduce<CategoryCountMap>((accumulator, category) => {
    accumulator[category] = 0;
    return accumulator;
  }, {} as CategoryCountMap);
}

/** Human-readable labels for each category */
export const CATEGORY_LABELS: Record<EmailCategory, string> = {
  project_proposal: 'Project Proposal',
  feedback_complaint: 'Feedback / Complaint',
  invoice_payment: 'Invoice / Payment',
  job_application: 'Job Application',
  vendor_inquiry: 'Vendor Inquiry',
  vendor_quote: 'Vendor Quote',
  general: 'General',
  junk: 'Junk / Spam',
  support_request: 'Support Request',
  needs_review: 'Needs Review',
};
