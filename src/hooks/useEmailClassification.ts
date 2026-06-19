import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useEmailStore } from '@/store/useEmailStore';
import { EmailItem, EmailCategory, EmailPriority } from '@/types/email';
import { generateMockEmails } from '@/utils/mockData';

const API_BASE_URL = process.env.REACT_APP_N8N_WEBHOOK_URL || '/api';

export const useEmails = () => {
  const syncCountersFromEmails = useEmailStore((state) => state.syncCountersFromEmails);

  const query = useQuery<EmailItem[]>({
    queryKey: ['emails'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/emails`);
      return data;
    },
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (Array.isArray(query.data)) {
      syncCountersFromEmails(query.data);
    }
  }, [query.data, syncCountersFromEmails]);

  return query;
};

export const useReclassifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ emailId, category, priority }: { emailId: string; category: EmailCategory; priority?: EmailPriority }) => {
      const { data } = await axios.post(`${API_BASE_URL}/emails/reclassify`, {
        emailId,
        category,
        priority,
      });
      return data;
    },
    onSuccess: () => {
      // Invalidate queries to trigger an immediate interface update
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });
};
