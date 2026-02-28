import { z } from 'zod';

const categories = ['audiencia', 'negociacao', 'cliente', 'cobranca', 'equipe', 'decisao', 'outro'] as const;
const emotions = ['ansiedade', 'raiva', 'medo', 'frustracao', 'inseguranca', 'culpa', 'outro'] as const;
const perceptions = ['reactive', 'strategic', 'unsure'] as const;

export const createEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  situation: z.string().min(10, 'Situação deve ter pelo menos 10 caracteres'),
  category: z.enum(categories),
  emotion: z.enum(emotions),
  intensity: z.number().int().min(1).max(10),
  reaction: z.string().min(10, 'Reação deve ter pelo menos 10 caracteres'),
  self_perception: z.enum(perceptions),
});

export const createReflectionSchema = z.object({
  entry_id: z.string().uuid('entry_id deve ser um UUID válido'),
});

export const updateReflectionSchema = z.object({
  answers: z.array(z.string().nullable()),
});

export const generateBriefingSchema = z.object({
  mentee_id: z.string().uuid('mentee_id deve ser um UUID válido'),
});

export const validateInviteCodeSchema = z.object({
  code: z.string().min(1, 'Código de convite é obrigatório'),
});
