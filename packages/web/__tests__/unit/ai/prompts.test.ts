import {
  REFLECTION_SYSTEM_PROMPT,
  WEEKLY_REPORT_SYSTEM_PROMPT,
  BRIEFING_SYSTEM_PROMPT,
  PATTERNS_SYSTEM_PROMPT,
  buildReflectionUserPrompt,
  buildWeeklyReportPrompt,
  buildBriefingPrompt,
  buildPatternsPrompt,
} from '@/lib/ai/prompts';
import type { DailyEntry, DailyEntryWithReflection } from '@/types/database';

/* ---------- fixtures ---------- */
const sampleEntry: DailyEntry = {
  id: 'entry-1',
  user_id: 'user-1',
  date: '2026-02-28',
  situation: 'Audiência difícil com cliente nervoso no fórum',
  category: 'audiencia',
  emotion: 'ansiedade',
  intensity: 8,
  reaction: 'Mantive a calma e argumentei com firmeza',
  self_perception: 'strategic',
  created_at: '2026-02-28T10:00:00Z',
};

const sampleEntryWithReflection: DailyEntryWithReflection = {
  ...sampleEntry,
  ai_reflections: {
    id: 'ref-1',
    entry_id: 'entry-1',
    questions: ['Pergunta 1?', 'Pergunta 2?'],
    answers: ['Resposta 1', null],
    created_at: '2026-02-28T10:01:00Z',
  },
};

/* ---------- system prompt content tests ---------- */
describe('system prompts – key content', () => {
  it('REFLECTION_SYSTEM_PROMPT references Código A.D.V. framework', () => {
    expect(REFLECTION_SYSTEM_PROMPT).toContain('Código A.D.V.');
    expect(REFLECTION_SYSTEM_PROMPT).toContain('Autogoverno');
    expect(REFLECTION_SYSTEM_PROMPT).toContain('Direção');
    expect(REFLECTION_SYSTEM_PROMPT).toContain('Verdade');
  });

  it('REFLECTION_SYSTEM_PROMPT contains anti-patterns to avoid', () => {
    expect(REFLECTION_SYSTEM_PROMPT).toContain('NÃO seja coach motivacional');
    expect(REFLECTION_SYSTEM_PROMPT).toContain('NÃO seja terapeuta');
    expect(REFLECTION_SYSTEM_PROMPT).toContain('JSON array');
  });

  it('WEEKLY_REPORT_SYSTEM_PROMPT defines the 5 required sections', () => {
    expect(WEEKLY_REPORT_SYSTEM_PROMPT).toContain('RESUMO');
    expect(WEEKLY_REPORT_SYSTEM_PROMPT).toContain('PADRÕES');
    expect(WEEKLY_REPORT_SYSTEM_PROMPT).toContain('EVOLUÇÃO');
    expect(WEEKLY_REPORT_SYSTEM_PROMPT).toContain('INSIGHT');
    expect(WEEKLY_REPORT_SYSTEM_PROMPT).toContain('DESAFIO');
  });

  it('BRIEFING_SYSTEM_PROMPT mentions Rafael Coelho and session preparation', () => {
    expect(BRIEFING_SYSTEM_PROMPT).toContain('Rafael Coelho');
    expect(BRIEFING_SYSTEM_PROMPT).toContain('briefing pré-sessão');
    expect(BRIEFING_SYSTEM_PROMPT).toContain('ATENÇÃO');
    expect(BRIEFING_SYSTEM_PROMPT).toContain('TEMAS');
    expect(BRIEFING_SYSTEM_PROMPT).toContain('PERGUNTAS');
  });

  it('PATTERNS_SYSTEM_PROMPT defines severity levels', () => {
    expect(PATTERNS_SYSTEM_PROMPT).toContain('positive');
    expect(PATTERNS_SYSTEM_PROMPT).toContain('attention');
    expect(PATTERNS_SYSTEM_PROMPT).toContain('critical');
    expect(PATTERNS_SYSTEM_PROMPT).toContain('A.D.V.');
  });
});

/* ---------- user prompt builder tests ---------- */
describe('buildReflectionUserPrompt', () => {
  it('includes all entry fields in Portuguese-labelled format', () => {
    const prompt = buildReflectionUserPrompt(sampleEntry);

    expect(prompt).toContain('Audiência difícil com cliente nervoso no fórum');
    expect(prompt).toContain('Audiência'); // CATEGORY_LABELS['audiencia']
    expect(prompt).toContain('Ansiedade'); // EMOTION_LABELS['ansiedade']
    expect(prompt).toContain('8/10');
    expect(prompt).toContain('Mantive a calma');
    expect(prompt).toContain('Estratégica'); // SELF_PERCEPTION_LABELS['strategic']
    expect(prompt).toContain('2-3 perguntas reflexivas');
  });
});

describe('buildWeeklyReportPrompt', () => {
  it('formats entries and includes intensity averages', () => {
    const entries = [sampleEntry, { ...sampleEntry, id: 'entry-2', intensity: 4 }];
    const prompt = buildWeeklyReportPrompt(entries, 5.5);

    expect(prompt).toContain('2 registros');
    expect(prompt).toContain('Intensidade média da semana anterior: 5.5');
    expect(prompt).toContain('Intensidade média desta semana: 6.0');
    expect(prompt).toContain('Gere o relatório semanal.');
  });

  it('handles null previousAvgIntensity', () => {
    const prompt = buildWeeklyReportPrompt([sampleEntry], null);

    expect(prompt).toContain('Sem dados da semana anterior.');
    expect(prompt).not.toContain('Intensidade média da semana anterior');
  });
});

describe('buildBriefingPrompt', () => {
  it('includes entry details and mentor notes', () => {
    const prompt = buildBriefingPrompt(
      [sampleEntryWithReflection],
      'Mentorado parece evoluindo bem'
    );

    expect(prompt).toContain('1 registros');
    expect(prompt).toContain('Audiência');
    expect(prompt).toContain('Ansiedade');
    expect(prompt).toContain('Respostas às reflexões');
    expect(prompt).toContain('Mentorado parece evoluindo bem');
    expect(prompt).toContain('Gere o briefing de pré-sessão.');
  });

  it('shows fallback text when no mentor notes exist', () => {
    const prompt = buildBriefingPrompt([sampleEntryWithReflection], null);

    expect(prompt).toContain('Sem notas anteriores do mentor.');
  });
});

describe('buildPatternsPrompt', () => {
  it('uses pipe-delimited compact format', () => {
    const prompt = buildPatternsPrompt([sampleEntry]);

    expect(prompt).toContain('2026-02-28|audiencia|ansiedade|8|strategic|');
    expect(prompt).toContain('1 registros');
    expect(prompt).toContain('Identifique os padrões mais relevantes');
  });
});
