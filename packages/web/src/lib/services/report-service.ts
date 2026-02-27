import { generateWeeklyReport } from '@/lib/ai/generate';
import { createWeeklyReport, getWeeklyReports, getWeeklyReportById } from '@/lib/db/reports';
import { getEntriesByDateRange } from '@/lib/db/entries';
import type { WeeklyReport } from '@/types/database';

function getWeekDates(date?: Date) {
  const now = date ?? new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
}

export async function generateAndSaveWeeklyReport(userId: string): Promise<WeeklyReport> {
  const currentWeek = getWeekDates();

  // Get previous week for comparison
  const prevWeekDate = new Date();
  prevWeekDate.setDate(prevWeekDate.getDate() - 7);
  const prevWeek = getWeekDates(prevWeekDate);

  const entries = await getEntriesByDateRange(userId, currentWeek.start, currentWeek.end);
  const prevEntries = await getEntriesByDateRange(userId, prevWeek.start, prevWeek.end);

  const previousAvgIntensity = prevEntries.length > 0
    ? prevEntries.reduce((sum, e) => sum + e.intensity, 0) / prevEntries.length
    : null;

  if (entries.length === 0) {
    return await createWeeklyReport({
      user_id: userId,
      week_start: currentWeek.start,
      week_end: currentWeek.end,
      summary: 'Nenhum registro esta semana. A consistência é fundamental para o autogoverno.',
      patterns: [],
      evolution: {
        avg_intensity_current: 0,
        avg_intensity_previous: previousAvgIntensity ?? 0,
        reactive_pct: 0,
        strategic_pct: 0,
      },
      insight: 'Registrar diariamente é o primeiro passo do autogoverno.',
      challenge: 'Registre pelo menos 3 dias na próxima semana.',
    });
  }

  const aiReport = await generateWeeklyReport(entries, previousAvgIntensity);

  const avgIntensity = entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length;
  const reactivePct = (entries.filter((e) => e.self_perception === 'reactive').length / entries.length) * 100;
  const strategicPct = (entries.filter((e) => e.self_perception === 'strategic').length / entries.length) * 100;

  return await createWeeklyReport({
    user_id: userId,
    week_start: currentWeek.start,
    week_end: currentWeek.end,
    summary: aiReport.summary || 'Resumo indisponível.',
    patterns: aiReport.patterns || [],
    evolution: {
      avg_intensity_current: avgIntensity,
      avg_intensity_previous: previousAvgIntensity ?? 0,
      reactive_pct: reactivePct,
      strategic_pct: strategicPct,
    },
    insight: aiReport.insight || '',
    challenge: aiReport.challenge || '',
  });
}

export async function fetchUserReports(userId: string) {
  return getWeeklyReports(userId);
}

export async function fetchReportById(reportId: string) {
  return getWeeklyReportById(reportId);
}
