'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/overview');
      if (!res.ok) throw new Error('Failed to fetch dashboard');
      return res.json();
    },
  });
}

export function useMenteesList() {
  return useQuery({
    queryKey: ['mentees-list'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/mentees');
      if (!res.ok) throw new Error('Failed to fetch mentees');
      return res.json();
    },
  });
}

export function useMenteeProfile(menteeId: string) {
  return useQuery({
    queryKey: ['mentee-profile', menteeId],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/mentees/${menteeId}`);
      if (!res.ok) throw new Error('Failed to fetch mentee profile');
      return res.json();
    },
    enabled: !!menteeId,
  });
}

export function useMenteeEntries(menteeId: string, page = 1) {
  return useQuery({
    queryKey: ['mentee-entries', menteeId, page],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/mentees/${menteeId}/entries?page=${page}`);
      if (!res.ok) throw new Error('Failed to fetch mentee entries');
      return res.json();
    },
    enabled: !!menteeId,
  });
}

export function useMenteePatterns(menteeId: string) {
  return useQuery({
    queryKey: ['mentee-patterns', menteeId],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/mentees/${menteeId}/patterns`);
      if (!res.ok) throw new Error('Failed to fetch patterns');
      return res.json();
    },
    enabled: !!menteeId,
  });
}

export function useGroupInsights(period: 'week' | 'month' = 'week') {
  return useQuery({
    queryKey: ['group-insights', period],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/insights?period=${period}`);
      if (!res.ok) throw new Error('Failed to fetch insights');
      return res.json();
    },
  });
}

export function useMentorNote(menteeId: string) {
  return useQuery({
    queryKey: ['mentor-note', menteeId],
    queryFn: async () => {
      const res = await fetch(`/api/mentor-notes/${menteeId}`);
      if (!res.ok) throw new Error('Failed to fetch note');
      return res.json();
    },
    enabled: !!menteeId,
  });
}

export function useUpdateMentorNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ menteeId, content }: { menteeId: string; content: string }) => {
      const res = await fetch(`/api/mentor-notes/${menteeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('Failed to save note');
      return res.json();
    },
    onSuccess: (_, { menteeId }) => {
      queryClient.invalidateQueries({ queryKey: ['mentor-note', menteeId] });
    },
  });
}

export function useGenerateBriefing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menteeId: string) => {
      const res = await fetch('/api/briefings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentee_id: menteeId }),
      });
      if (!res.ok) throw new Error('Failed to generate briefing');
      return res.json();
    },
    onSuccess: (_, menteeId) => {
      queryClient.invalidateQueries({ queryKey: ['briefings', menteeId] });
    },
  });
}

export function useBriefingHistory(menteeId: string) {
  return useQuery({
    queryKey: ['briefings', menteeId],
    queryFn: async () => {
      const res = await fetch(`/api/briefings/${menteeId}`);
      if (!res.ok) throw new Error('Failed to fetch briefings');
      return res.json();
    },
    enabled: !!menteeId,
  });
}
