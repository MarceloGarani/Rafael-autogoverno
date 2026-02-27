import { getAnthropicClient } from './client';
import {
  REFLECTION_SYSTEM_PROMPT,
  buildReflectionUserPrompt,
  WEEKLY_REPORT_SYSTEM_PROMPT,
  buildWeeklyReportPrompt,
  BRIEFING_SYSTEM_PROMPT,
  buildBriefingPrompt,
  PATTERNS_SYSTEM_PROMPT,
  buildPatternsPrompt,
} from './prompts';
import type { DailyEntry, DailyEntryWithReflection } from '@/types/database';

async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  const client = getAnthropicClient();

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const textBlock = message.content.find((b) => b.type === 'text');
  return textBlock?.text ?? '';
}

export async function generateReflection(entry: DailyEntry): Promise<string[]> {
  const response = await callClaude(
    REFLECTION_SYSTEM_PROMPT,
    buildReflectionUserPrompt(entry)
  );

  try {
    const questions = JSON.parse(response);
    if (Array.isArray(questions) && questions.length >= 2 && questions.length <= 3) {
      return questions;
    }
    return ['O que você faria diferente se pudesse voltar a esse momento?', 'Essa reação reflete quem você quer ser como profissional?'];
  } catch {
    return ['O que você faria diferente se pudesse voltar a esse momento?', 'Essa reação reflete quem você quer ser como profissional?'];
  }
}

export async function generateWeeklyReport(
  entries: DailyEntry[],
  previousAvgIntensity: number | null
) {
  const response = await callClaude(
    WEEKLY_REPORT_SYSTEM_PROMPT,
    buildWeeklyReportPrompt(entries, previousAvgIntensity)
  );

  try {
    return JSON.parse(response);
  } catch {
    return {
      summary: 'Não foi possível gerar o relatório automaticamente.',
      patterns: [],
      evolution_text: '',
      insight: '',
      challenge: 'Continue registrando diariamente para receber análises mais detalhadas.',
    };
  }
}

export async function generateBriefing(
  entries: DailyEntryWithReflection[],
  mentorNotes: string | null
) {
  const response = await callClaude(
    BRIEFING_SYSTEM_PROMPT,
    buildBriefingPrompt(entries, mentorNotes)
  );

  try {
    return JSON.parse(response);
  } catch {
    return {
      summary: 'Não foi possível gerar o briefing automaticamente.',
      patterns: [],
      attention_points: [],
      suggested_topics: [],
      suggested_questions: [],
    };
  }
}

export async function generatePatterns(entries: DailyEntry[]) {
  const response = await callClaude(
    PATTERNS_SYSTEM_PROMPT,
    buildPatternsPrompt(entries)
  );

  try {
    return JSON.parse(response);
  } catch {
    return { patterns: [] };
  }
}
