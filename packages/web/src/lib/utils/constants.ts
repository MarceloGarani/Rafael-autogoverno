import type { EntryCategory, EntryEmotion, SelfPerceptionType, BadgeType } from '@/types/database';

export const CATEGORY_LABELS: Record<EntryCategory, string> = {
  audiencia: 'Audiência',
  negociacao: 'Negociação',
  cliente: 'Cliente',
  cobranca: 'Cobrança',
  equipe: 'Equipe',
  decisao: 'Decisão',
  outro: 'Outro',
};

export const EMOTION_LABELS: Record<EntryEmotion, string> = {
  ansiedade: 'Ansiedade',
  raiva: 'Raiva',
  medo: 'Medo',
  frustracao: 'Frustração',
  inseguranca: 'Insegurança',
  culpa: 'Culpa',
  outro: 'Outro',
};

export const SELF_PERCEPTION_LABELS: Record<SelfPerceptionType, string> = {
  reactive: 'Reativa',
  strategic: 'Estratégica',
  unsure: 'Não sei',
};

export const BADGE_LABELS: Record<BadgeType, { name: string; description: string }> = {
  '7_days': { name: '7 Dias', description: 'Primeira semana completa' },
  '30_days': { name: '30 Dias', description: 'Primeiro mês de consistência' },
  '90_days': { name: 'Mestre do Autogoverno', description: '90 dias consecutivos' },
  perfect_week: { name: 'Semana Perfeita', description: '7/7 dias registrados na semana' },
};

export function getIntensityColor(intensity: number): string {
  if (intensity <= 3) return '#4CAF50';
  if (intensity <= 6) return '#FFC107';
  return '#E53935';
}

export function getIntensityLabel(intensity: number): string {
  if (intensity <= 3) return 'Baixa';
  if (intensity <= 6) return 'Média';
  return 'Alta';
}
