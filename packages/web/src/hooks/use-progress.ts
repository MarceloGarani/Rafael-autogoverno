'use client';

import { useQuery } from '@tanstack/react-query';

export function useProgress(period: 'month' | '3months' | 'all' = 'month') {
  return useQuery({
    queryKey: ['progress', period],
    queryFn: async () => {
      const res = await fetch(`/api/progress?period=${period}`);
      if (!res.ok) throw new Error('Failed to fetch progress');
      return res.json();
    },
  });
}
