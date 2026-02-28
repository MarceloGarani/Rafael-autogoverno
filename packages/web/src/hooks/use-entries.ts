'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { EntryCategory, EntryEmotion } from '@/types/database';

interface Filters {
  period?: 'week' | 'month' | 'custom';
  start_date?: string;
  end_date?: string;
  category?: EntryCategory;
  emotion?: EntryEmotion;
}

export function useEntries(filters?: Filters) {
  return useInfiniteQuery({
    queryKey: ['entries', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      params.set('page', String(pageParam));
      params.set('limit', '20');
      if (filters?.period) params.set('period', filters.period);
      if (filters?.start_date) params.set('start_date', filters.start_date);
      if (filters?.end_date) params.set('end_date', filters.end_date);
      if (filters?.category) params.set('category', filters.category);
      if (filters?.emotion) params.set('emotion', filters.emotion);

      const res = await fetch(`/api/entries?${params}`);
      if (!res.ok) throw new Error('Failed to fetch entries');
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.entries.length, 0);
      return loaded < lastPage.total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

export function useCreateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      date: string;
      situation: string;
      category: string;
      emotion: string;
      intensity: number;
      reaction: string;
      self_perception: string;
    }) => {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create entry');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['streak'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
}
