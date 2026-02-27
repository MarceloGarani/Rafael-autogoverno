export type UserRole = 'mentee' | 'mentor';
export type EntryCategory = 'audiencia' | 'negociacao' | 'cliente' | 'cobranca' | 'equipe' | 'decisao' | 'outro';
export type EntryEmotion = 'ansiedade' | 'raiva' | 'medo' | 'frustracao' | 'inseguranca' | 'culpa' | 'outro';
export type SelfPerceptionType = 'reactive' | 'strategic' | 'unsure';
export type BadgeType = '7_days' | '30_days' | '90_days' | 'perfect_week';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  reminder_enabled: boolean;
  created_at: string;
}

export interface DailyEntry {
  id: string;
  user_id: string;
  date: string;
  situation: string;
  category: EntryCategory;
  emotion: EntryEmotion;
  intensity: number;
  reaction: string;
  self_perception: SelfPerceptionType;
  created_at: string;
}

export interface AIReflection {
  id: string;
  entry_id: string;
  questions: string[];
  answers: (string | null)[] | null;
  created_at: string;
}

export interface WeeklyReport {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  summary: string;
  patterns: PatternItem[];
  evolution: EvolutionData;
  insight: string;
  challenge: string;
  created_at: string;
}

export interface PatternItem {
  description: string;
  frequency: number;
  category?: EntryCategory;
  emotion?: EntryEmotion;
}

export interface EvolutionData {
  avg_intensity_current: number;
  avg_intensity_previous: number;
  reactive_pct: number;
  strategic_pct: number;
}

export interface MentorNote {
  id: string;
  mentor_id: string;
  mentee_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface SessionBriefing {
  id: string;
  mentor_id: string;
  mentee_id: string;
  generated_at: string;
  summary: string;
  patterns: BriefingPattern[];
  suggested_topics: string[];
  suggested_questions: string[];
  mentor_previous_notes: string | null;
}

export interface BriefingPattern {
  description: string;
  adv_connection: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_type: BadgeType;
  earned_at: string;
}

export interface DailyEntryWithReflection extends DailyEntry {
  ai_reflections: AIReflection | null;
}

export interface StreakData {
  current_streak: number;
  max_streak: number;
}
