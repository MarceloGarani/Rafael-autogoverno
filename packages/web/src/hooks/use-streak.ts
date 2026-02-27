'use client';

import { useQuery } from '@tanstack/react-query';
import type { StreakData } from '@/types/database';

export function useStreak() {
  return useQuery<StreakData>({
    queryKey: ['streak'],
    queryFn: async () => {
      const res = await fetch('/api/progress/streak');
      if (!res.ok) throw new Error('Failed to fetch streak');
      return res.json();
    },
  });
}
