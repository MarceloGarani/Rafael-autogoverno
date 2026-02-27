// Mock @anthropic-ai/sdk before any imports to prevent runtime check
jest.mock('@anthropic-ai/sdk', () => ({}));

import { generateAndSaveWeeklyReport, fetchUserReports, fetchReportById } from '@/lib/services/report-service';
import { generateWeeklyReport } from '@/lib/ai/generate';
import { createWeeklyReport, getWeeklyReports, getWeeklyReportById } from '@/lib/db/reports';
import { getEntriesByDateRange } from '@/lib/db/entries';
import type { DailyEntry, WeeklyReport } from '@/types/database';

jest.mock('@/lib/ai/generate');
jest.mock('@/lib/db/reports');
jest.mock('@/lib/db/entries');

const mockedGenerateWeeklyReport = generateWeeklyReport as jest.MockedFunction<typeof generateWeeklyReport>;
const mockedCreateWeeklyReport = createWeeklyReport as jest.MockedFunction<typeof createWeeklyReport>;
const mockedGetWeeklyReports = getWeeklyReports as jest.MockedFunction<typeof getWeeklyReports>;
const mockedGetWeeklyReportById = getWeeklyReportById as jest.MockedFunction<typeof getWeeklyReportById>;
const mockedGetEntriesByDateRange = getEntriesByDateRange as jest.MockedFunction<typeof getEntriesByDateRange>;

const mockEntries: DailyEntry[] = [
  {
    id: 'e1',
    user_id: 'user-1',
    date: '2026-02-23',
    situation: 'Audiencia',
    category: 'audiencia',
    emotion: 'ansiedade',
    intensity: 6,
    reaction: 'Mantive o foco',
    self_perception: 'strategic',
    created_at: '2026-02-23T08:00:00Z',
  },
  {
    id: 'e2',
    user_id: 'user-1',
    date: '2026-02-24',
    situation: 'Cliente irritado',
    category: 'cliente',
    emotion: 'raiva',
    intensity: 8,
    reaction: 'Reagi defensivamente',
    self_perception: 'reactive',
    created_at: '2026-02-24T08:00:00Z',
  },
];

const mockReport: WeeklyReport = {
  id: 'report-1',
  user_id: 'user-1',
  week_start: '2026-02-23',
  week_end: '2026-03-01',
  summary: 'Semana com desafios emocionais.',
  patterns: [{ description: 'Ansiedade em audiencias', frequency: 3 }],
  evolution: {
    avg_intensity_current: 7,
    avg_intensity_previous: 5,
    reactive_pct: 50,
    strategic_pct: 50,
  },
  insight: 'Observe o padrao de reatividade com clientes.',
  challenge: 'Pratique respiracao antes de reunioes.',
  created_at: '2026-02-28T12:00:00Z',
};

describe('report-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAndSaveWeeklyReport', () => {
    it('should generate a report with AI when entries exist', async () => {
      // Current week entries
      mockedGetEntriesByDateRange.mockResolvedValueOnce(mockEntries);
      // Previous week entries (for comparison)
      mockedGetEntriesByDateRange.mockResolvedValueOnce([]);

      mockedGenerateWeeklyReport.mockResolvedValue({
        summary: 'Semana com desafios emocionais.',
        patterns: [{ description: 'Ansiedade em audiencias', frequency: 3 }],
        insight: 'Observe o padrao de reatividade com clientes.',
        challenge: 'Pratique respiracao antes de reunioes.',
      });

      mockedCreateWeeklyReport.mockResolvedValue(mockReport);

      const result = await generateAndSaveWeeklyReport('user-1');

      expect(mockedGetEntriesByDateRange).toHaveBeenCalledTimes(2);
      expect(mockedGenerateWeeklyReport).toHaveBeenCalledWith(mockEntries, null);
      expect(mockedCreateWeeklyReport).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-1',
          summary: 'Semana com desafios emocionais.',
        })
      );
      expect(result).toEqual(mockReport);
    });

    it('should create a default report when no entries exist for the week', async () => {
      // Current week: no entries
      mockedGetEntriesByDateRange.mockResolvedValueOnce([]);
      // Previous week: no entries
      mockedGetEntriesByDateRange.mockResolvedValueOnce([]);

      mockedCreateWeeklyReport.mockResolvedValue({
        ...mockReport,
        summary: 'Nenhum registro esta semana. A consistência é fundamental para o autogoverno.',
        patterns: [],
        evolution: {
          avg_intensity_current: 0,
          avg_intensity_previous: 0,
          reactive_pct: 0,
          strategic_pct: 0,
        },
        insight: 'Registrar diariamente é o primeiro passo do autogoverno.',
        challenge: 'Registre pelo menos 3 dias na próxima semana.',
      });

      const result = await generateAndSaveWeeklyReport('user-1');

      expect(mockedGenerateWeeklyReport).not.toHaveBeenCalled();
      expect(mockedCreateWeeklyReport).toHaveBeenCalledWith(
        expect.objectContaining({
          summary: 'Nenhum registro esta semana. A consistência é fundamental para o autogoverno.',
          patterns: [],
          evolution: expect.objectContaining({
            avg_intensity_current: 0,
            reactive_pct: 0,
            strategic_pct: 0,
          }),
        })
      );
      expect(result.summary).toContain('Nenhum registro');
    });

    it('should compute previous week average intensity for comparison', async () => {
      const prevEntries: DailyEntry[] = [
        { ...mockEntries[0], intensity: 4 },
        { ...mockEntries[1], intensity: 6 },
      ];
      // Current week entries
      mockedGetEntriesByDateRange.mockResolvedValueOnce(mockEntries);
      // Previous week entries
      mockedGetEntriesByDateRange.mockResolvedValueOnce(prevEntries);

      mockedGenerateWeeklyReport.mockResolvedValue({
        summary: 'Summary',
        patterns: [],
        insight: 'Insight',
        challenge: 'Challenge',
      });
      mockedCreateWeeklyReport.mockResolvedValue(mockReport);

      await generateAndSaveWeeklyReport('user-1');

      // Previous avg = (4+6)/2 = 5
      expect(mockedGenerateWeeklyReport).toHaveBeenCalledWith(mockEntries, 5);
    });
  });

  describe('fetchUserReports', () => {
    it('should delegate to getWeeklyReports', async () => {
      mockedGetWeeklyReports.mockResolvedValue([mockReport]);
      const result = await fetchUserReports('user-1');
      expect(result).toEqual([mockReport]);
      expect(mockedGetWeeklyReports).toHaveBeenCalledWith('user-1');
    });
  });

  describe('fetchReportById', () => {
    it('should return report when found', async () => {
      mockedGetWeeklyReportById.mockResolvedValue(mockReport);
      const result = await fetchReportById('report-1');
      expect(result).toEqual(mockReport);
    });

    it('should return null when report not found', async () => {
      mockedGetWeeklyReportById.mockResolvedValue(null);
      const result = await fetchReportById('nonexistent');
      expect(result).toBeNull();
    });
  });
});
