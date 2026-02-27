import {
  CATEGORY_LABELS,
  EMOTION_LABELS,
  SELF_PERCEPTION_LABELS,
  BADGE_LABELS,
  getIntensityColor,
  getIntensityLabel,
} from '@/lib/utils/constants';

describe('constants – label maps', () => {
  it('CATEGORY_LABELS maps all 7 categories to Portuguese labels', () => {
    const keys = Object.keys(CATEGORY_LABELS);
    expect(keys).toHaveLength(7);
    expect(CATEGORY_LABELS.audiencia).toBe('Audiência');
    expect(CATEGORY_LABELS.negociacao).toBe('Negociação');
    expect(CATEGORY_LABELS.cobranca).toBe('Cobrança');
    expect(CATEGORY_LABELS.equipe).toBe('Equipe');
    expect(CATEGORY_LABELS.decisao).toBe('Decisão');
    expect(CATEGORY_LABELS.cliente).toBe('Cliente');
    expect(CATEGORY_LABELS.outro).toBe('Outro');
  });

  it('EMOTION_LABELS maps all 7 emotions to Portuguese labels', () => {
    const keys = Object.keys(EMOTION_LABELS);
    expect(keys).toHaveLength(7);
    expect(EMOTION_LABELS.ansiedade).toBe('Ansiedade');
    expect(EMOTION_LABELS.frustracao).toBe('Frustração');
    expect(EMOTION_LABELS.inseguranca).toBe('Insegurança');
    expect(EMOTION_LABELS.raiva).toBe('Raiva');
    expect(EMOTION_LABELS.medo).toBe('Medo');
    expect(EMOTION_LABELS.culpa).toBe('Culpa');
    expect(EMOTION_LABELS.outro).toBe('Outro');
  });

  it('SELF_PERCEPTION_LABELS maps all 3 perception types', () => {
    expect(Object.keys(SELF_PERCEPTION_LABELS)).toHaveLength(3);
    expect(SELF_PERCEPTION_LABELS.reactive).toBe('Reativa');
    expect(SELF_PERCEPTION_LABELS.strategic).toBe('Estratégica');
    expect(SELF_PERCEPTION_LABELS.unsure).toBe('Não sei');
  });

  it('BADGE_LABELS contains name and description for every badge type', () => {
    expect(Object.keys(BADGE_LABELS)).toHaveLength(4);
    expect(BADGE_LABELS['7_days']).toEqual({
      name: '7 Dias',
      description: 'Primeira semana completa',
    });
    expect(BADGE_LABELS['90_days'].name).toBe('Mestre do Autogoverno');
    expect(BADGE_LABELS.perfect_week.description).toBe(
      '7/7 dias registrados na semana'
    );
  });
});

describe('getIntensityColor', () => {
  it('returns green (#4CAF50) for low intensity (1-3)', () => {
    expect(getIntensityColor(1)).toBe('#4CAF50');
    expect(getIntensityColor(2)).toBe('#4CAF50');
    expect(getIntensityColor(3)).toBe('#4CAF50');
  });

  it('returns yellow (#FFC107) for medium intensity (4-6)', () => {
    expect(getIntensityColor(4)).toBe('#FFC107');
    expect(getIntensityColor(5)).toBe('#FFC107');
    expect(getIntensityColor(6)).toBe('#FFC107');
  });

  it('returns red (#E53935) for high intensity (7-10)', () => {
    expect(getIntensityColor(7)).toBe('#E53935');
    expect(getIntensityColor(8)).toBe('#E53935');
    expect(getIntensityColor(10)).toBe('#E53935');
  });
});

describe('getIntensityLabel', () => {
  it('returns "Baixa" for intensity 1-3', () => {
    expect(getIntensityLabel(1)).toBe('Baixa');
    expect(getIntensityLabel(3)).toBe('Baixa');
  });

  it('returns "Média" for intensity 4-6', () => {
    expect(getIntensityLabel(4)).toBe('Média');
    expect(getIntensityLabel(6)).toBe('Média');
  });

  it('returns "Alta" for intensity 7-10', () => {
    expect(getIntensityLabel(7)).toBe('Alta');
    expect(getIntensityLabel(10)).toBe('Alta');
  });
});
