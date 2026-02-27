'use client';

import { create } from 'zustand';
import type { EntryCategory, EntryEmotion, SelfPerceptionType } from '@/types/database';

interface EntryDraft {
  situation: string;
  category: EntryCategory | null;
  emotion: EntryEmotion | null;
  intensity: number;
  reaction: string;
  self_perception: SelfPerceptionType | null;
}

interface AppStore {
  // Entry draft
  entryDraft: EntryDraft;
  setEntryDraft: (draft: Partial<EntryDraft>) => void;
  resetEntryDraft: () => void;

  // Mentor mode
  mentorMode: 'dashboard' | 'diary';
  setMentorMode: (mode: 'dashboard' | 'diary') => void;
}

const initialDraft: EntryDraft = {
  situation: '',
  category: null,
  emotion: null,
  intensity: 5,
  reaction: '',
  self_perception: null,
};

export const useStore = create<AppStore>((set) => ({
  entryDraft: { ...initialDraft },
  setEntryDraft: (draft) =>
    set((state) => ({
      entryDraft: { ...state.entryDraft, ...draft },
    })),
  resetEntryDraft: () => set({ entryDraft: { ...initialDraft } }),

  mentorMode: 'dashboard',
  setMentorMode: (mode) => set({ mentorMode: mode }),
}));
