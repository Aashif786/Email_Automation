import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  CONFIDENCE_THRESHOLD,
  EMAIL_CATEGORIES,
  createEmptyCategoryCounts,
  isAutoRoutedEmail,
  isManualReviewEmail,
  type EmailCategory,
  type EmailItem,
  type EmailQueueCounts,
} from '@/types/email';

export type ActiveView = 'dashboard' | 'triage' | 'inbox' | 'detail';
export type Theme = 'dark' | 'light';

export interface EmailFilterState {
  activeCategoryFilter: EmailCategory | null;
  searchQuery: string;
  priorityFilter: EmailItem['priority'] | null;
  activeView: ActiveView;
  theme: Theme;
}

export interface EmailSelectionState {
  selectedEmailId: string | null;
  highlightedEmailId: string | null;
}

export interface EmailCounterState {
  total: number;
  autoRouted: number;
  manualReview: number;
  byCategory: Record<EmailCategory, number>;
  lastSyncedAt: string | null;
}

interface EmailStore extends EmailFilterState, EmailSelectionState {
  counters: EmailCounterState;

  setCategoryFilter: (category: EmailCategory | null) => void;
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: EmailItem['priority'] | null) => void;
  setActiveView: (view: ActiveView) => void;
  setSelectedEmailId: (emailId: string | null) => void;
  setHighlightedEmailId: (emailId: string | null) => void;
  clearFilters: () => void;
  clearSelection: () => void;
  resetStore: () => void;
  toggleTheme: () => void;

  syncCountersFromEmails: (emails: EmailItem[]) => void;
  getCounts: (emails: EmailItem[]) => EmailQueueCounts;
  getManualReviewQueue: (emails: EmailItem[]) => EmailItem[];
  getAutomatedEmails: (emails: EmailItem[]) => EmailItem[];
  getFilteredEmails: (emails: EmailItem[]) => EmailItem[];
  getSelectedEmail: (emails: EmailItem[]) => EmailItem | null;
  getEmailsByCategory: (emails: EmailItem[], category: EmailCategory) => EmailItem[];
}

const initialCounterState: EmailCounterState = {
  total: 0,
  autoRouted: 0,
  manualReview: 0,
  byCategory: createEmptyCategoryCounts(),
  lastSyncedAt: null,
};

const initialFilterState: EmailFilterState = {
  activeCategoryFilter: null,
  searchQuery: '',
  priorityFilter: null,
  activeView: 'dashboard',
  theme: 'dark',
};

const initialSelectionState: EmailSelectionState = {
  selectedEmailId: null,
  highlightedEmailId: null,
};

function computeCounts(emails: EmailItem[]): EmailQueueCounts {
  const byCategory = createEmptyCategoryCounts();
  let autoRouted = 0;
  let manualReview = 0;

  for (const email of emails) {
    if (isAutoRoutedEmail(email)) {
      autoRouted += 1;
      if (email.category && EMAIL_CATEGORIES.includes(email.category as EmailCategory)) {
        byCategory[email.category as EmailCategory] += 1;
      }
    } else if (isManualReviewEmail(email)) {
      manualReview += 1;
    }
  }

  return {
    total: emails.length,
    autoRouted,
    manualReview,
    byCategory,
  };
}

function matchesSearchQuery(email: EmailItem, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  const haystack = [
    email.from,
    email.subject,
    email.textPlain,
    email.category,
    email.priority,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function sortByProcessedAtDesc(emails: EmailItem[]): EmailItem[] {
  return [...emails].sort(
    (left, right) =>
      new Date(right.processedAt).getTime() - new Date(left.processedAt).getTime()
  );
}

export const useEmailStore = create<EmailStore>()(
  devtools(
    (set, get) => ({
      ...initialFilterState,
      ...initialSelectionState,
      counters: initialCounterState,

      setCategoryFilter: (category) =>
        set({ activeCategoryFilter: category }, false, 'setCategoryFilter'),

      setSearchQuery: (query) =>
        set({ searchQuery: query }, false, 'setSearchQuery'),

      setPriorityFilter: (priority) =>
        set({ priorityFilter: priority }, false, 'setPriorityFilter'),

      setActiveView: (view) =>
        set({ activeView: view }, false, 'setActiveView'),

      setSelectedEmailId: (emailId) =>
        set({ selectedEmailId: emailId }, false, 'setSelectedEmailId'),

      setHighlightedEmailId: (emailId) =>
        set({ highlightedEmailId: emailId }, false, 'setHighlightedEmailId'),

      clearFilters: () =>
        set(
          {
            activeCategoryFilter: null,
            searchQuery: '',
            priorityFilter: null,
          },
          false,
          'clearFilters'
        ),

      clearSelection: () =>
        set(
          {
            selectedEmailId: null,
            highlightedEmailId: null,
          },
          false,
          'clearSelection'
        ),

      resetStore: () =>
        set(
          {
            ...initialFilterState,
            ...initialSelectionState,
            counters: initialCounterState,
          },
          false,
          'resetStore'
        ),

      toggleTheme: () =>
        set(
          (state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }),
          false,
          'toggleTheme'
        ),

      syncCountersFromEmails: (emails) => {
        const counts = computeCounts(emails);
        set(
          {
            counters: {
              total: counts.total,
              autoRouted: counts.autoRouted,
              manualReview: counts.manualReview,
              byCategory: counts.byCategory,
              lastSyncedAt: new Date().toISOString(),
            },
          },
          false,
          'syncCountersFromEmails'
        );
      },

      getCounts: (emails) => computeCounts(emails),

      getManualReviewQueue: (emails) =>
        sortByProcessedAtDesc(
          emails.filter(
            (email) =>
              email.confidence < CONFIDENCE_THRESHOLD &&
              email.status === 'unclassified'
          )
        ),

      getAutomatedEmails: (emails) =>
        sortByProcessedAtDesc(emails.filter((email) => isAutoRoutedEmail(email))),

      getFilteredEmails: (emails) => {
        const {
          activeCategoryFilter,
          searchQuery,
          priorityFilter,
          activeView,
        } = get();

        let scopedEmails = emails;

        if (activeView === 'triage') {
          scopedEmails = get().getManualReviewQueue(emails);
        } else if (activeView === 'inbox') {
          scopedEmails = get().getAutomatedEmails(emails);
        }

        const filtered = scopedEmails.filter((email) => {
          if (activeCategoryFilter && email.category !== activeCategoryFilter) {
            return false;
          }

          if (priorityFilter && email.priority !== priorityFilter) {
            return false;
          }

          return matchesSearchQuery(email, searchQuery);
        });

        return sortByProcessedAtDesc(filtered);
      },

      getSelectedEmail: (emails) => {
        const { selectedEmailId } = get();
        if (!selectedEmailId) {
          return null;
        }
        return emails.find((email) => email.id === selectedEmailId) ?? null;
      },

      getEmailsByCategory: (emails, category) =>
        sortByProcessedAtDesc(
          emails.filter(
            (email) =>
              isAutoRoutedEmail(email) &&
              email.category === category
          )
        ),
    }),
    { name: 'CaldimEmailStore' }
  )
);

export { CONFIDENCE_THRESHOLD, EMAIL_CATEGORIES };
