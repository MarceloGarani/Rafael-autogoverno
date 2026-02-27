'use client';

export const dynamic = 'force-dynamic';

import { useDashboardOverview } from '@/hooks/use-dashboard';
import { DashboardOverview, Heading } from '@diario/ui';

export default function DashboardPage() {
  const { data, isLoading } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Heading level={1} size="xl">Dashboard — Visão Geral</Heading>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-neutral-900 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-48 bg-neutral-900 rounded-lg animate-pulse" />
        <div className="h-48 bg-neutral-900 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <Heading level={1} size="xl" className="mb-6">Dashboard — Visão Geral</Heading>
      <DashboardOverview
        summaryCards={[
          { label: 'Mentorados Ativos', value: data.total_mentees },
          { label: 'Registros Semana', value: data.entries_this_week },
          { label: 'Engajamento', value: `${data.engagement_pct}%` },
          { label: 'Alertas', value: data.alerts_count, trend: data.alerts_count > 0 ? 'up' : 'neutral' },
        ]}
        alerts={data.alerts}
        recentActivity={data.recent_activity}
      />
    </div>
  );
}
