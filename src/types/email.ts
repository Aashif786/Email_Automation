export const CONFIDENCE_THRESHOLD = 0.65 as const;

export const EMAIL_CATEGORIES = [
  'project_proposal',
  'feedback_complaint',
  'invoice_payment',
  'job_application',
  'vendor_inquiry',
  'general',
  'vendor_quote',
  'junk',
] as const;

export type EmailCategory = (typeof EMAIL_CATEGORIES)[number];

export type EmailPriority = 'high' | 'medium' | 'low';

export type EmailStatus = 'classified' | 'unclassified';

export interface EmailAttachment {
  fileName: string;
  contentType?: string;
  binaryKey: string;
}

export interface EmailItem {
  id: string;
  from: string;
  subject: string;
  textPlain: string;
  category: EmailCategory | '';
  confidence: number;
  priority: EmailPriority;
  processedAt: string;
  status: EmailStatus;
  attachments: EmailAttachment[];
}

export type CategoryCountMap = Record<EmailCategory, number>;

export interface EmailQueueCounts {
  total: number;
  autoRouted: number;
  manualReview: number;
  byCategory: CategoryCountMap;
}

export function isClassifiedEmail(email: EmailItem): boolean {
  if (email.status === 'classified') {
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
  return email.status === 'classified' || email.confidence >= CONFIDENCE_THRESHOLD;
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
