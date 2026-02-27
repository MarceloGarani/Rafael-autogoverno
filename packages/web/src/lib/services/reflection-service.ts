import { generateReflection } from '@/lib/ai/generate';
import { createReflection, updateReflectionAnswers, getReflectionByEntryId } from '@/lib/db/reflections';
import { getEntryById } from '@/lib/db/entries';
import type { AIReflection } from '@/types/database';

export async function generateAndSaveReflection(entryId: string): Promise<AIReflection> {
  const entry = await getEntryById(entryId);
  if (!entry) throw new Error('Entry not found');

  try {
    const questions = await generateReflection(entry);
    return await createReflection(entryId, questions);
  } catch {
    // Fallback: save with default questions
    const defaultQuestions = [
      'O que você faria diferente se pudesse voltar a esse momento?',
      'Essa reação reflete quem você quer ser como profissional?',
    ];
    return await createReflection(entryId, defaultQuestions);
  }
}

export async function saveReflectionAnswers(
  reflectionId: string,
  answers: (string | null)[]
): Promise<AIReflection> {
  return await updateReflectionAnswers(reflectionId, answers);
}

export async function fetchReflection(entryId: string): Promise<AIReflection | null> {
  return getReflectionByEntryId(entryId);
}
